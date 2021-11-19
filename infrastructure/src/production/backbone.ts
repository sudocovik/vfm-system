import type {
    ClusterConfiguration,
    DomainConfiguration,
    LoadBalancerConfiguration,
    ProjectConfiguration,
} from './backbone-types'
import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'
import * as k8s from '@pulumi/kubernetes'

export function generateKubeconfig(
    cluster: digitalocean.KubernetesCluster,
    user: pulumi.Input<string>,
    apiToken: pulumi.Input<string>,
): pulumi.Output<string> {
    const clusterName = pulumi.interpolate`do-${cluster.region}-${cluster.name}`

    return pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.kubeConfigs[0].clusterCaCertificate}
    server: ${cluster.endpoint}
  name: ${clusterName}
contexts:
- context:
    cluster: ${clusterName}
    user: ${clusterName}-${user}
  name: ${clusterName}
current-context: ${clusterName}
kind: Config
users:
- name: ${clusterName}-${user}
  user:
    token: ${apiToken}
`;
}

export const describeBackboneResources = (
    domainConfiguration: DomainConfiguration,
    loadBalancerConfiguration: LoadBalancerConfiguration,
    clusterConfiguration: ClusterConfiguration,
    projectConfiguration: ProjectConfiguration
) => (): any => {
    const domain = new digitalocean.Domain('primary-domain', {
        name: domainConfiguration.name
    })

    const certificate = new digitalocean.Certificate('certificate', {
        type: 'lets_encrypt',
        domains: [
            domain.name,
            domain.name.apply(domainName => `*.${domainName}`)
        ]
    }, {
        parent: domain
    })

    const loadBalancer = new digitalocean.LoadBalancer('primary-load-balancer', {
        name: loadBalancerConfiguration.name,
        size: loadBalancerConfiguration.size,
        region: loadBalancerConfiguration.region,
        dropletTag: clusterConfiguration.nodePool.tag,
        redirectHttpToHttps: true,
        forwardingRules: [{
            entryPort: loadBalancerConfiguration.ports.http.external,
            entryProtocol: 'http',
            targetPort: loadBalancerConfiguration.ports.http.internal,
            targetProtocol: 'http'
        }, {
            entryPort: loadBalancerConfiguration.ports.https.external,
            entryProtocol: 'https',
            targetPort: loadBalancerConfiguration.ports.https.internal,
            targetProtocol: 'http',
            certificateName: certificate.name,
        }, {
            entryPort: loadBalancerConfiguration.ports.teltonika.external,
            entryProtocol: 'tcp',
            targetPort: loadBalancerConfiguration.ports.teltonika.internal,
            targetProtocol: 'tcp'
        }],
        healthcheck: {
            path: '/',
            port: loadBalancerConfiguration.ports.http.internal,
            protocol: 'http',
            checkIntervalSeconds: 10,
            responseTimeoutSeconds: 5,
            unhealthyThreshold: 3,
            healthyThreshold: 5
        }
    })

    new digitalocean.DnsRecord('wildcard-subdomain', {
        domain: domain.name,
        name: '*',
        type: 'A',
        value: loadBalancer.ip
    }, {
        parent: domain
    })

    const cluster = new digitalocean.KubernetesCluster('primary-cluster', {
        name: clusterConfiguration.name,
        version: clusterConfiguration.version,
        region: clusterConfiguration.region,
        autoUpgrade: false,
        nodePool: {
            name: clusterConfiguration.nodePool.name,
            size: clusterConfiguration.nodePool.size,
            autoScale: false,
            nodeCount: clusterConfiguration.nodePool.count,
            tags: [clusterConfiguration.nodePool.tag]
        }
    })

    new digitalocean.Project('primary-project', {
        name: projectConfiguration.name,
        environment: projectConfiguration.environment,
        description: projectConfiguration.description,
        purpose: projectConfiguration.purpose,
        resources: [
            domain.domainUrn,
            cluster.clusterUrn,
            loadBalancer.loadBalancerUrn
        ]
    })

    const kubeconfig = generateKubeconfig(cluster, 'admin', clusterConfiguration.tokenForKubeconfig)

    const provider: k8s.Provider = new k8s.Provider('kubernetes-provider', {
        kubeconfig
    }, {
        parent: cluster
    })

    const namespace = new k8s.core.v1.Namespace('primary-namespace', {
        metadata: {
            name: clusterConfiguration.namespace
        }
    }, {
        provider,
        parent: provider
    })

    const namespaceName = namespace.metadata.name

    new k8s.helm.v3.Chart('ingress-controller', {
        chart: 'traefik',
        version: clusterConfiguration.traefikVersion,
        fetchOpts: {
            repo: 'https://helm.traefik.io/traefik',
        },
        namespace: namespaceName,
        values: {
            ingressRoute: {
                dashboard: {
                    enabled: false
                }
            },
            service: {
                type: 'NodePort',
            },
            ports: {
                web: {
                    nodePort: loadBalancerConfiguration.ports.http.internal
                },
                websecure: {
                    expose: false
                }
            },
        },
        transformations: [
            (obj: any) => {
                if (obj.kind === 'Service') {
                    obj.metadata.namespace = namespaceName
                    obj.metadata.annotations = {
                        'kubernetes.digitalocean.com/firewall-managed': 'false'
                    }
                }
            },
        ]
    }, {
        provider,
        parent: namespace
    })

    const dockerLogin = {
        auths: {
            'ghcr.io': {
                auth: Buffer.from('covik:' + clusterConfiguration.containerRegistryToken).toString('base64')
            }
        }
    }
    const containerRegistryCredentials = new k8s.core.v1.Secret('container-registry-credentials', {
        metadata: {
            namespace: namespaceName,
            name: 'container-registry'
        },
        type: 'kubernetes.io/dockerconfigjson',
        data: {
            '.dockerconfigjson': Buffer.from(JSON.stringify(dockerLogin), 'utf8').toString('base64')
        }
    }, {
        provider,
        parent: namespace
    })

    return {
        kubeconfig,
        namespaceName,
        domainName: domain.name,
        containerRegistryCredentialsName: containerRegistryCredentials.metadata.name,
        clusterId: cluster.id,
    }
}