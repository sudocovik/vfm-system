import * as k8s from '@pulumi/kubernetes'

function createNamespace(provider: k8s.Provider): k8s.core.v1.Namespace {
    return new k8s.core.v1.Namespace('vfm', {}, {
        provider
    })
}

export function createKubernetesManifests(kubeconfig: string): void {
    const provider: k8s.Provider = new k8s.Provider('main-kubernetes-provider', {
        kubeconfig
    })

    const namespace = createNamespace(provider).metadata.name

    const labels = { app: 'nginx' }

    const deployment = new k8s.apps.v1.Deployment('nginx-test', {
        metadata: {
            namespace
        },
        spec: {
            selector: { matchLabels: labels },
            replicas: 1,
            template: {
                metadata: { labels: labels },
                spec: {
                    containers: [{
                        name: 'nginx',
                        image: 'nginx:1.21-alpine',
                        ports: [{
                            containerPort: 80,
                            protocol: 'TCP'
                        }]
                    }]
                }
            }
        }
    }, { provider })

    const service = new k8s.core.v1.Service('nginx-test', {
        metadata: {
            namespace,
            labels: deployment.spec.template.metadata.labels
        },
        spec: {
            type: 'ClusterIP',
            ports: [{
                port: 8080,
                targetPort: 80,
                protocol: 'TCP'
            }],
            selector: deployment.spec.template.metadata.labels,
        },
    }, { provider })

    const testNamespace = new k8s.core.v1.Namespace('traefik', {}, {
        provider
    })

    const traefik = new k8s.helm.v3.Chart('traefik-ingress', {
        chart: 'traefik',
        version: '10.3.2',
        fetchOpts: {
            repo: 'https://helm.traefik.io/traefik',
        },
        namespace: testNamespace.metadata.name,
        values: {
            ingressRoute: {
                dashboard: {
                    enabled: false
                }
            },
            service: {
                type: 'NodePort'
            },
            ports: {
                web: {
                    nodePort: 32080
                }
            }
        }
    }, { provider })

    new k8s.networking.v1.Ingress('default-ingress', {
        metadata: {
            namespace
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
                                    number: service.spec.ports[0].port
                                }
                            }
                        }
                    }]
                }
            }]
        }
    }, { provider, dependsOn: [ traefik ] })
}
