import { DigitalOceanDomain, DigitalOceanCluster, DigitalOceanProject } from '../resources/cloud'
import { Domain, DropletSlug, KubernetesCluster, LoadBalancer, Project } from '@pulumi/digitalocean'

function createPulumiDomain(domain: DigitalOceanDomain): Domain {
    return new Domain('main-domain', {
        name: domain.name()
    })
}

function createPulumiLoadBalancer(): LoadBalancer {
    return new LoadBalancer('main-load-balancer', {
        size: 'lb-small',
        region: 'fra1',
        forwardingRules: [{
            entryPort: 80,
            entryProtocol: 'http',
            targetPort: 32080,
            targetProtocol: 'http'
        }]
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
            nodeCount: 1
        }
    })
}

function createPulumiProject(project: DigitalOceanProject, domain: Domain, cluster: KubernetesCluster): Project {
    return new Project('main-project', {
        name: project.name(),
        environment: project.environment(),
        description: project.description(),
        purpose: project.purpose(),
        resources: [
            domain.domainUrn,
            cluster.clusterUrn
        ]
    })
}

export async function createCloudResources(): Promise<string> {
    createPulumiLoadBalancer()
    const domain = createPulumiDomain(new DigitalOceanDomain())
    const cluster = createPulumiCluster(new DigitalOceanCluster())
    createPulumiProject(new DigitalOceanProject(), domain, cluster)

    return cluster.kubeConfigs[0].rawConfig.apply(config => config) as string
}