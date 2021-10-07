import { DigitalOceanDomain, DigitalOceanCluster, DigitalOceanProject } from '../resources/cloud'
import {
    Certificate,
    DnsRecord,
    Domain,
    DropletSlug,
    KubernetesCluster,
    LoadBalancer,
    Project,
} from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'

const workerNodeTagName = 'vfm-worker'

function createPulumiDomain(domain: DigitalOceanDomain): Domain {
    return new Domain('main-domain', {
        name: domain.name()
    })
}

function createPulumiDnsRecordConnectingDomainWithLoadBalancer(domain: Domain, loadbalancer: LoadBalancer): DnsRecord {
    return new DnsRecord('app-subdomain', {
        domain: domain.name,
        name: 'app',
        type: 'A',
        value: loadbalancer.ip
    })
}

function createPulumiCertificate(domain: Domain, subdomain: string): Certificate {
    return new Certificate('main-certificate', {
        type: 'lets_encrypt',
        domains: [
            domain.name,
            domain.name.apply(domainName => `${subdomain}.${domainName}`)
        ]
    })
}

function createPulumiLoadBalancer(certificate: Certificate): LoadBalancer {
    return new LoadBalancer('main-load-balancer', {
        size: 'lb-small',
        region: 'fra1',
        dropletTag: workerNodeTagName,
        redirectHttpToHttps: true,
        forwardingRules: [{
            entryPort: 80,
            entryProtocol: 'http',
            targetPort: 32080,
            targetProtocol: 'http'
        }, {
            entryPort: 443,
            entryProtocol: 'https',
            targetPort: 32080,
            targetProtocol: 'http',
            certificateName: certificate.name,
        }, {
            entryPort: 5027,
            entryProtocol: 'tcp',
            targetPort: 32027,
            targetProtocol: 'tcp'
        }],
        healthcheck: {
            path: '/',
            port: 32080,
            protocol: 'http',
            checkIntervalSeconds: 10,
            responseTimeoutSeconds: 5,
            unhealthyThreshold: 3,
            healthyThreshold: 5
        }
    })
}

export function createTokenKubeconfig(
    cluster: KubernetesCluster,
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

function createPulumiCluster(cluster: DigitalOceanCluster): KubernetesCluster {
    return new KubernetesCluster('main-cluster', {
        name: cluster.name(),
        version: cluster.version(),
        region: 'fra1',
        autoUpgrade: false,
        nodePool: {
            name: 'worker',
            size: DropletSlug.DropletS1VCPU2GB,
            autoScale: false,
            nodeCount: 1,
            tags: [workerNodeTagName]
        }
    })
}

function createPulumiProject(project: DigitalOceanProject, domain: Domain, cluster: KubernetesCluster, loadbalancer: LoadBalancer): Project {
    return new Project('main-project', {
        name: project.name(),
        environment: project.environment(),
        description: project.description(),
        purpose: project.purpose(),
        resources: [
            domain.domainUrn,
            cluster.clusterUrn,
            loadbalancer.loadBalancerUrn
        ]
    })
}

export async function createCloudResources(clusterToken: string): Promise<string> {
    const domain = createPulumiDomain(new DigitalOceanDomain())
    const certificate = createPulumiCertificate(domain, 'app')
    const loadbalancer = createPulumiLoadBalancer(certificate)
    createPulumiDnsRecordConnectingDomainWithLoadBalancer(domain, loadbalancer)
    const cluster = createPulumiCluster(new DigitalOceanCluster())
    createPulumiProject(new DigitalOceanProject(), domain, cluster, loadbalancer)

    return createTokenKubeconfig(cluster, 'admin', clusterToken) as string
}