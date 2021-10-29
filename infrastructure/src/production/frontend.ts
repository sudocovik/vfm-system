import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import provision from '../pulumi/provision'

export function describeFrontendResources(): any {
    const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
    const kubeconfig = backbone.getOutput('kubeconfig')
    const namespace = backbone.getOutput('namespaceName')
    const domain = backbone.getOutput('domainName')
    const subdomain = domain.apply(domainName => `app.${domainName}`)

    const provider: k8s.Provider = new k8s.Provider('main-kubernetes-provider', {
        kubeconfig
    })

    const labels = { app: 'test' }

    const deployment = new k8s.apps.v1.Deployment('test-deployment', {
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
                    containers: [{
                        name: 'webserver',
                        image: 'nginx:1.21.1-alpine',
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
    }, { provider })

    const service = new k8s.core.v1.Service('test-service', {
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
    }, { provider })

    new k8s.networking.v1.Ingress('test-ingress', {
        metadata: {
            namespace
        },
        spec: {
            rules: [{
                host: subdomain,
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
    }, { provider })
}

export function deployFrontendResources(): void {
    provision('frontend-production', async () => describeFrontendResources())
}
