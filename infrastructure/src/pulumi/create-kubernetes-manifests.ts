import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import * as docker from '@pulumi/docker'

function createNamespace(provider: k8s.Provider): k8s.core.v1.Namespace {
    return new k8s.core.v1.Namespace('vfm', {
        metadata: {
            name: 'vfm'
        }
    }, {
        provider
    })
}

function replaceRegistryUrlWithUrlClusterUnderstands(originalImageName: pulumi.Output<string>): pulumi.Output<string> {
    return originalImageName.apply(imageName => imageName.replace(/^localhost/, 'vfm-registry'))
}

function createFrontendApplication(provider: k8s.Provider, namespace: pulumi.Output<string>, ingressController: k8s.helm.v3.Chart): void {
    const labels = { app: 'frontend' }

    const image = new docker.Image('frontend', {
        imageName: 'localhost:5000/vfm-frontend',
        build: {
            context: '/frontend',
            target: 'development-environment',
            env: {
                'DOCKER_BUILDKIT': '1'
            }
        }
    })
    const imageName = replaceRegistryUrlWithUrlClusterUnderstands(image.imageName)

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
                        image: imageName,
                        imagePullPolicy: 'IfNotPresent',
                        ports: [{
                            name: 'http',
                            containerPort: 8080,
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
        dependsOn: [ ingressController ]
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

    const traefik = new k8s.helm.v3.Chart('default-ingress-controller', {
        chart: 'traefik',
        version: '10.6.0',
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
                },
                websecure: {
                    expose: false
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

    createFrontendApplication(provider, namespace, traefik)

/*
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
 */
}
