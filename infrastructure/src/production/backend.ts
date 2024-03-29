import * as pulumi from '@pulumi/pulumi'
import { Output } from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'
import * as k8s from '@pulumi/kubernetes'
import { Program } from '../pulumi/Program'
import { Stack } from '../pulumi/Stack'
import { Domain } from '../../config'
import { createKubernetesProvider } from '../components/KubernetesProvider'

type DatabaseConnection = {
    host: pulumi.Output<string>
    port: pulumi.Output<number>
    user: pulumi.Output<string>
    password: pulumi.Output<string>
    database: pulumi.Output<string>
}

function describeDatabase (kubernetesCluster: pulumi.Output<string>): DatabaseConnection {
  const cluster = new digitalocean.DatabaseCluster('database-cluster', {
    name: 'vfm',
    region: 'fra1',
    size: 'db-s-1vcpu-1gb',
    nodeCount: 1,
    engine: 'mysql',
    version: '8',
    maintenanceWindows: [{
      day: 'sunday',
      hour: '12:00'
    }]
  })

  new digitalocean.DatabaseFirewall('database-firewall', {
    clusterId: cluster.id,
    rules: [{
      type: 'k8s',
      value: kubernetesCluster
    }]
  }, {
    parent: cluster
  })

  const user = new digitalocean.DatabaseUser('database-user', {
    clusterId: cluster.id,
    name: 'regular'
  }, {
    parent: cluster
  })

  const database = new digitalocean.DatabaseDb('database', {
    clusterId: cluster.id,
    name: 'vfm'
  }, {
    parent: cluster
  })

  return {
    host: cluster.privateHost,
    port: cluster.port,
    user: user.name,
    password: user.password,
    database: database.name
  }
}

function describeApplication (provider: k8s.Provider, namespace: pulumi.Output<string>, databaseConnectionSettings: DatabaseConnection): void {
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

  <entry key='database.driver'>com.mysql.cj.jdbc.Driver</entry>
  <entry key='database.url'>jdbc:mysql://${databaseConnectionSettings.host}:${databaseConnectionSettings.port}/${databaseConnectionSettings.database}</entry>
  <entry key='database.user'>${databaseConnectionSettings.user}</entry>
  <entry key='database.password'>${databaseConnectionSettings.password}</entry>
  <entry key='database.saveOriginal'>true</entry>

  <entry key='web.origin'>*</entry>
  <entry key='web.persistSession'>true</entry>

  <entry key='geocoder.format'>%r %h, %p %t, %s, %c</entry>
  <entry key='geocoder.key'>${process.env.REVERSE_GEOCODING_TOKEN}</entry>
  <entry key='geocoder.onRequest'>false</entry>
  <entry key='geocoder.processInvalidPositions'>false</entry>
  <entry key='geocoder.reuseDistance'>50</entry>

  <entry key='filter.enable'>true</entry>
  <entry key='filter.zero'>true</entry>

  <entry key='logger.file'>/proc/1/fd/1</entry>

  <entry key='mail.smtp.host'>smtp.zoho.eu</entry>
  <entry key='mail.smtp.port'>587</entry>
  <entry key='mail.smtp.starttls.enable'>true</entry>
  <entry key='mail.smtp.from'>notifications@zarafleet.com</entry>
  <entry key='mail.smtp.auth'>true</entry>
  <entry key='mail.smtp.username'>notifications@zarafleet.com</entry>
  <entry key='mail.smtp.password'>${process.env.NOTIFICATIONS_EMAIL_PASSWORD}</entry>

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

  const labels = { app: 'traccar' }
  const configurationVolumeName = 'configuration'

  const deployment: k8s.apps.v1.Deployment = new k8s.apps.v1.Deployment('traccar', {
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
          labels: labels
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
            image: 'traccar/traccar:4.15-alpine',
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

  new k8s.core.v1.Service('traccar-teltonika-service', {
    metadata: {
      namespace,
      annotations: {
        'kubernetes.digitalocean.com/firewall-managed': 'false'
      }
    },
    spec: {
      type: 'NodePort',
      selector: labels,
      ports: [{
        name: 'teltonika',
        port: 5027,
        nodePort: 32027,
        targetPort: deployment.spec.template.spec.containers[0].ports[1].name,
        protocol: 'TCP'
      }]
    }
  }, {
    provider,
    parent: provider
  })

  const service: k8s.core.v1.Service = new k8s.core.v1.Service('traccar-http-service', {
    metadata: {
      namespace
    },
    spec: {
      selector: labels,
      ports: [{
        name: 'api',
        port: 80,
        targetPort: deployment.spec.template.spec.containers[0].ports[0].name,
        protocol: 'TCP'
      }]
    }
  }, {
    provider,
    parent: provider
  })

  new k8s.networking.v1.Ingress('traccar-ingress', {
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
                name: service.metadata.name,
                port: {
                  name: service.spec.ports[0].name
                }
              }
            }
          }]
        }
      }, {
        host: Domain.traccar,
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
      }, {
        host: Domain.newFrontend,
        http: {
          paths: [{
            path: '/api',
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
    parent: provider
  })
}

async function describeBackendResources (): Promise<void> {
  const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
  const kubeconfig = backbone.getOutput('kubeconfig')
  const namespaceName = <Output<string>>backbone.getOutput('namespaceName')
  const kubernetesClusterId = <Output<string>>backbone.getOutput('clusterId')

  const provider = createKubernetesProvider(kubeconfig)

  const databaseConnectionSettings = describeDatabase(kubernetesClusterId)
  describeApplication(provider, namespaceName, databaseConnectionSettings)
}

export function deployBackendResources (): void {
  Program.forStack(
    new Stack('backend-production', describeBackendResources)
  ).execute()
}
