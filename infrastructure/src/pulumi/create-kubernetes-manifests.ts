import * as k8s from '@pulumi/kubernetes'

function createNamespace(provider: k8s.Provider): k8s.core.v1.Namespace {
    return new k8s.core.v1.Namespace('vfm', {
        metadata: {
            name: 'vfm'
        }
    }, {
        provider
    })
}

export function createKubernetesManifests(kubeconfig: string): void {
    const provider: k8s.Provider = new k8s.Provider('main-kubernetes-provider', {
        kubeconfig
    })

    const namespace = createNamespace(provider).metadata.name

    const traccarLabels = { app: 'traccar' }

    const traccarDeployment: k8s.apps.v1.Deployment = new k8s.apps.v1.Deployment('traccar-deployment', {
        metadata: {
            namespace
        },
        spec: {
            selector: {
                matchLabels: traccarLabels
            },
            template: {
                metadata: {
                    labels:  traccarLabels
                },
                spec: {
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
                            periodSeconds: 30,
                        }
                    }]
                }
            }
        }
    }, { provider })

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

    const traefik = new k8s.helm.v3.Chart('default-ingress-controller', {
        chart: 'traefik',
        version: '10.3.2',
        fetchOpts: {
            repo: 'https://helm.traefik.io/traefik',
        },
        namespace: namespace,
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
        },
        transformations: [
            (obj: any) => {
                if (obj.kind === 'Service') {
                    obj.metadata.namespace = namespace
                }
            },
        ]
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
    }, { provider, dependsOn: [ traefik ] })
}
