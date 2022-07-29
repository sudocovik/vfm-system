import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import * as docker from '@pulumi/docker'
import { createTraefikIngressController } from '../components/TraefikIngressController'
import { createNamespace } from '../components/Namespace'
import { createKubernetesProvider } from '../components/KubernetesProvider'
import { imageName } from '../local-environment/frontend'

function createFrontendApplication (provider: k8s.Provider, namespace: pulumi.Output<string>, ingressController: k8s.helm.v3.Chart): void {
  const labels = { app: 'frontend' }
  const volumes = { hotReload: 'hot-reload' }

  const image = docker.getRemoteImageOutput({ name: imageName })
  const fullImageNameWithSha256Tag = image.repoDigest

  const deployment = new k8s.apps.v1.Deployment('new-application', {
    metadata: {
      namespace
    },
    spec: {
      selector: {
        matchLabels: labels
      },
      replicas: 1,
      template: {
        metadata: {
          labels
        },
        spec: {
          restartPolicy: 'Always',
          containers: [{
            name: 'webserver',
            image: fullImageNameWithSha256Tag,
            imagePullPolicy: 'IfNotPresent',
            ports: [{
              name: 'http',
              containerPort: 8080,
              protocol: 'TCP'
            }],
            volumeMounts: [{
              name: volumes.hotReload,
              mountPath: '/app'
            }]
          }],
          volumes: [{
            name: volumes.hotReload,
            hostPath: {
              path: '/frontend',
              type: 'Directory'
            }
          }]
        }
      }
    }
  }, {
    provider,
    parent: provider
  })

  const service = new k8s.core.v1.Service('new-web', {
    metadata: {
      namespace
    },
    spec: {
      selector: labels,
      ports: [{
        name: 'http',
        port: 80,
        targetPort: deployment.spec.template.spec.containers[0].ports[0].name,
        protocol: 'TCP'
      }]
    }
  }, {
    provider,
    parent: provider
  })

  new k8s.networking.v1.Ingress('new-web-access', {
    metadata: {
      namespace,
      annotations: {
        'pulumi.com/skipAwait': 'true'
      }
    },
    spec: {
      rules: [{
        http: {
          paths: [{
            path: '/',
            pathType: 'Prefix',
            backend: {
              service: {
                name: service.metadata.name,
                port: {
                  name: service.spec.ports[0].name
                }
              }
            }
          }]
        }
      }]
    }
  }, {
    provider,
    parent: provider,
    dependsOn: [ingressController]
  })
}

export function createKubernetesManifests (kubeconfig: string): void {
  const provider = createKubernetesProvider(kubeconfig)

  const namespace = createNamespace({ provider }).metadata.name

  const configuration = new k8s.core.v1.ConfigMap('traccar-configuration', {
    metadata: {
      namespace
    },
    data: {
      'traccar.xml':
                pulumi.interpolate`<?xml version='1.0' encoding='UTF-8'?>

<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>

<properties>

  <entry key='config.default'>./conf/default.xml</entry>

  <!--
  This is the main configuration file. All your configuration parameters should be placed in this file.
  Default configuration parameters are located in the "default.xml" file. You should not modify it to avoid issues
  with upgrading to a new version. Parameters in the main config file override values in the default file. Do not
  remove "config.default" parameter from this file unless you know what you are doing.
  For list of available parameters see following page: https://www.traccar.org/configuration-file/
  -->

  <entry key='database.driver'>org.h2.Driver</entry>
  <entry key='database.url'>jdbc:h2:./data/database</entry>
  <entry key='database.user'>sa</entry>
  <entry key='database.password'></entry>
  <entry key='database.saveOriginal'>true</entry>

  <entry key='web.origin'>*</entry>

  <entry key='geocoder.format'>%r %h, %p %t, %s, %c</entry>

  <entry key='filter.enable'>true</entry>
  <entry key='filter.zero'>true</entry>

  <entry key='logger.file'>/proc/1/fd/1</entry>

</properties>`,
      'ignitionOn.vm':
`#set($subject = "$device.name: kontakt uključen")
<!DOCTYPE html>
<html>
<body>
Kontakt je uključen na vozilu $device.name
</body>
</html>`
    }
  }, {
    provider,
    parent: provider
  })

  const traccarLabels = { app: 'traccar' }
  const configurationVolumeName = 'configuration'

  const traccarDeployment: k8s.apps.v1.Deployment = new k8s.apps.v1.Deployment('traccar', {
    metadata: {
      namespace
    },
    spec: {
      selector: {
        matchLabels: traccarLabels
      },
      replicas: 1,
      template: {
        metadata: {
          labels: traccarLabels
        },
        spec: {
          volumes: [{
            name: configurationVolumeName,
            configMap: {
              name: configuration.metadata.name
            }
          }],
          restartPolicy: 'Always',
          containers: [{
            name: 'backend',
            image: 'traccar/traccar:4.13-alpine',
            imagePullPolicy: 'IfNotPresent',
            ports: [{
              name: 'api',
              containerPort: 8082,
              protocol: 'TCP'
            }, {
              name: 'teltonika',
              containerPort: 5027,
              protocol: 'TCP'
            }],
            startupProbe: {
              httpGet: {
                path: '/',
                port: 'api',
                scheme: 'HTTP'
              },
              failureThreshold: 30,
              periodSeconds: 30
            },
            volumeMounts: [{
              name: configurationVolumeName,
              mountPath: '/opt/traccar/conf/traccar.xml',
              subPath: 'traccar.xml',
              readOnly: true
            }, {
              name: configurationVolumeName,
              mountPath: '/opt/traccar/templates/full/ignitionOn.vm',
              subPath: 'ignitionOn.vm',
              readOnly: true
            }]
          }]
        }
      }
    }
  }, {
    provider,
    parent: provider
  })

  const traccarApiService: k8s.core.v1.Service = new k8s.core.v1.Service('traccar-api-service', {
    metadata: {
      namespace
    },
    spec: {
      selector: traccarLabels,
      ports: [{
        name: 'api',
        port: 80,
        targetPort: traccarDeployment.spec.template.spec.containers[0].ports[0].name,
        protocol: 'TCP'
      }]
    }
  }, { provider })

  new k8s.core.v1.Service('traccar-teltonika-service', {
    metadata: {
      namespace
    },
    spec: {
      type: 'NodePort',
      selector: traccarLabels,
      ports: [{
        name: 'teltonika',
        port: 5027,
        nodePort: 32027,
        targetPort: traccarDeployment.spec.template.spec.containers[0].ports[1].name,
        protocol: 'TCP'
      }]
    }
  }, { provider })

  const traefik = createTraefikIngressController(namespace, { provider })

  new k8s.networking.v1.Ingress('traefik-ingress', {
    metadata: {
      namespace,
      annotations: {
        'pulumi.com/skipAwait': 'true'
      }
    },
    spec: {
      rules: [{
        http: {
          paths: [{
            path: '/api',
            pathType: 'Prefix',
            backend: {
              service: {
                name: traccarApiService.metadata.name,
                port: {
                  name: traccarApiService.spec.ports[0].name
                }
              }
            }
          }]
        }
      }]
    }
  }, { provider, dependsOn: [traefik] })

  createFrontendApplication(provider, namespace, traefik)
}
