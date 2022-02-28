import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { Domain } from '../../config'
import { Output } from '@pulumi/pulumi'

function describeOldFrontend (
  provider: k8s.Provider,
  namespace: pulumi.Output<string>,
  containerRegistrySecret: pulumi.Output<string>
): void {
  const labels = { app: 'old-frontend' }

  const deployment = new k8s.apps.v1.Deployment('application', {
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
          imagePullSecrets: [{ name: containerRegistrySecret }],
          containers: [{
            name: 'webserver',
            image: 'ghcr.io/covik/tracking-frontend:0.0.14',
            imagePullPolicy: 'IfNotPresent',
            ports: [{
              name: 'http',
              containerPort: 80,
              protocol: 'TCP'
            }]
          }]
        }
      }
    }
  }, {
    provider,
    parent: provider
  })

  const service = new k8s.core.v1.Service('web', {
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

  new k8s.networking.v1.Ingress('public-access', {
    metadata: {
      namespace,
      annotations: {
        'pulumi.com/skipAwait': 'true'
      }
    },
    spec: {
      rules: [{
        // host: subdomain,
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
    parent: provider
  })
}

function describeNewFrontend (
  provider: k8s.Provider,
  namespace: pulumi.Output<string>,
  containerRegistrySecret: pulumi.Output<string>,
  version: string
): void {
  const labels = { app: 'new-frontend' }

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
          imagePullSecrets: [{ name: containerRegistrySecret }],
          restartPolicy: 'Always',
          containers: [{
            name: 'webserver',
            image: 'ghcr.io/covik/vfm-frontend:' + version,
            imagePullPolicy: 'IfNotPresent',
            ports: [{
              name: 'http',
              containerPort: 80,
              protocol: 'TCP'
            }]
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
        host: Domain.newFrontend,
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
    parent: provider
  })
}

export const describeFrontendResources = (applicationVersion: string): () => Promise<void> => async () => {
  const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
  const kubeconfig = backbone.getOutput('kubeconfig')
  const namespace = <Output<string>>backbone.getOutput('namespaceName')
  const containerRegistrySecret = <Output<string>>backbone.getOutput('containerRegistryCredentialsName')

  const provider: k8s.Provider = new k8s.Provider('kubernetes-provider', {
    kubeconfig
  })

  describeOldFrontend(provider, namespace, containerRegistrySecret)
  describeNewFrontend(provider, namespace, containerRegistrySecret, applicationVersion)
}

export function deployFrontendResources (): void {
  const applicationVersion: string = process.env.APPLICATION_VERSION || ''

  Program.forStack(
    new Stack('frontend-production', describeFrontendResources(applicationVersion))
  ).execute()
}
