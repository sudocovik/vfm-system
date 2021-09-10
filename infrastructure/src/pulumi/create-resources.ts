import { DigitalOceanDomain, DigitalOceanCluster, DigitalOceanProject } from '../resources/cloud'
import { DnsRecord, Domain, DropletSlug, KubernetesCluster, LoadBalancer, Project } from '@pulumi/digitalocean'

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

function createPulumiLoadBalancer(): LoadBalancer {
    return new LoadBalancer('main-load-balancer', {
        size: 'lb-small',
        region: 'fra1',
        dropletTag: workerNodeTagName,
        forwardingRules: [{
            entryPort: 80,
            entryProtocol: 'http',
            targetPort: 32080,
            targetProtocol: 'http'
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

export async function createCloudResources(): Promise<string> {
    const loadbalancer = createPulumiLoadBalancer()
    const domain = createPulumiDomain(new DigitalOceanDomain())
    createPulumiDnsRecordConnectingDomainWithLoadBalancer(domain, loadbalancer)
    const cluster = createPulumiCluster(new DigitalOceanCluster())
    createPulumiProject(new DigitalOceanProject(), domain, cluster, loadbalancer)

    return cluster.kubeConfigs[0].rawConfig.apply(config => config) as string
}