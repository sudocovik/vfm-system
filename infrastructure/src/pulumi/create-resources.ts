import { DigitalOceanDomain, DigitalOceanCluster, DigitalOceanProject } from '../resources/cloud'
import { Domain, DropletSlug, KubernetesCluster, Project } from '@pulumi/digitalocean'

function createPulumiDomain(domain: DigitalOceanDomain): Domain {
    return new Domain('vfm-domain', {
        name: domain.name()
    })
}

function createPulumiCluster(cluster: DigitalOceanCluster): KubernetesCluster {
    return new KubernetesCluster('vfm-cluster', {
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
    const domain = createPulumiDomain(new DigitalOceanDomain())
    const cluster = createPulumiCluster(new DigitalOceanCluster())
    createPulumiProject(new DigitalOceanProject(), domain, cluster)

    return cluster.kubeConfigs[0].rawConfig.apply(config => config) as string
}