import provision from '../pulumi/provision'
import { DatabaseCluster, DatabaseDb, DatabaseFirewall, DatabaseUser } from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'

type DatabaseConnection = {
    host: pulumi.Output<string>
    port: pulumi.Output<number>
    user: pulumi.Output<string>
    password: pulumi.Output<string>
    database: pulumi.Output<string>
}

function describeDatabase(kubernetesCluster: pulumi.Output<any>): DatabaseConnection {
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

    const user = new DatabaseUser('main-database-user', {
        clusterId: cluster.id,
        name: 'regular'
    })

    const database = new DatabaseDb('main-database-db', {
        clusterId: cluster.id,
        name: 'vfm'
    })

    return {
        host: cluster.privateHost,
        port: cluster.port,
        user: user.name,
        password: user.password,
        database: database.name
    }
}

function describeApplication(provider: k8s.Provider, namespace: pulumi.Output<any>, databaseConnectionSettings: DatabaseConnection): void {
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

  <entry key='geocoder.format'>%r %h, %p %t, %s, %c</entry>

  <entry key='filter.enable'>true</entry>
  <entry key='filter.zero'>true</entry>

</properties>`
        }
    }, { provider })

    const labels = { app: 'traccar' }
    const configurationVolumeName = 'configuration'

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
                        args: [
                            '-jar',
                            'tracker-server.jar',
                            'conf-custom/traccar.xml',
                        ],
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
                        },
                        volumeMounts: [{
                            name: configurationVolumeName,
                            mountPath: '/opt/traccar/conf-custom',
                            readOnly: true
                        }]
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

    const databaseConnectionSettings = describeDatabase(kubernetesClusterId)
    describeApplication(provider, namespaceName, databaseConnectionSettings)
}

export function deployBackendResources(): void {
    provision('backend-production', async () => describeBackendResources())
}