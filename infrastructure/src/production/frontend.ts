import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'

function describeOldFrontend(
    provider: k8s.Provider,
    namespace: pulumi.Output<any>,
    containerRegistrySecret: pulumi.Output<any>
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
            namespace
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
        parent: provider,
    })
}

function describeNewFrontend(
    provider: k8s.Provider,
    namespace: pulumi.Output<any>,
    containerRegistrySecret: pulumi.Output<any>,
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
            namespace
        },
        spec: {
            rules: [{
                host: 'new.zarafleet.com',
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
    })
}

export const describeFrontendResources = (applicationVersion: string) => (): void => {
    const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
    const kubeconfig = backbone.getOutput('kubeconfig')
    const namespace = backbone.getOutput('namespaceName')
    const domain = backbone.getOutput('domainName')
    const subdomain = domain.apply(domainName => `app.${domainName}`)
    const containerRegistrySecret = backbone.getOutput('containerRegistryCredentialsName')

    const provider: k8s.Provider = new k8s.Provider('kubernetes-provider', {
        kubeconfig
    })

    describeOldFrontend(provider, namespace, containerRegistrySecret)
    describeNewFrontend(provider, namespace, containerRegistrySecret, applicationVersion)
}

export function deployFrontendResources(): void {
    const applicationVersion: string = process.env.APPLICATION_VERSION || ''

    Program.forStack(
        new Stack('frontend-production', describeFrontendResources(applicationVersion))
    ).execute()
}
