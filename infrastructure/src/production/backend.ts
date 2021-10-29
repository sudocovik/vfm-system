import provision from '../pulumi/provision'
import { DatabaseCluster, DatabaseDb, DatabaseFirewall, DatabaseUser } from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'

function describeDatabase(kubernetesCluster: pulumi.Output<any>): void {
    const cluster = new DatabaseCluster('main-backend-database', {
        name: 'vfm-database',
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

    new DatabaseFirewall('main-database-firewall', {
        clusterId: cluster.id,
        rules: [{
            type: 'k8s',
            value: kubernetesCluster
        }]
    })

    new DatabaseUser('main-database-user', {
        clusterId: cluster.id,
        name: 'regular'
    })

    new DatabaseDb('main-database-db', {
        clusterId: cluster.id,
        name: 'vfm'
    })
}

function describeApplication(provider: k8s.Provider, namespace: pulumi.Output<any>): void {
    const labels = { app: 'traccar' }

    const deployment: k8s.apps.v1.Deployment = new k8s.apps.v1.Deployment('traccar-deployment', {
        metadata: {
            namespace
        },
        spec: {
            selector: {
                matchLabels: labels
            },
            template: {
                metadata: {
                    labels:  labels
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

    new k8s.core.v1.Service('traccar-teltonika-service', {
        metadata: {
            namespace
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
    }, { provider })

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
    }, { provider })

    new k8s.networking.v1.Ingress('default-ingress', {
        metadata: {
            namespace
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
            }]
        }
    }, { provider })
}

function describeBackendResources(): any {
    const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
    const kubeconfig = backbone.getOutput('kubeconfig')
    const namespaceName = backbone.getOutput('namespaceName')
    const kubernetesClusterId = backbone.getOutput('clusterId')

    const provider: k8s.Provider = new k8s.Provider('main-kubernetes-provider', {
        kubeconfig
    })

    describeDatabase(kubernetesClusterId)
    describeApplication(provider, namespaceName)
}

export function deployBackendResources(): void {
    provision('backend-production', async () => describeBackendResources())
}