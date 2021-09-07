import { Domain, Project, KubernetesCluster, DropletSlug } from '@pulumi/digitalocean'
import { DigitalOceanCluster } from './DigitalOceanCluster'
import { DigitalOceanDomain } from './DigitalOceanDomain'
import { DigitalOceanProject } from './DigitalOceanProject'

export default class {
    public provisionAll(): void {
        const domain: Domain = this.provisionDomain()
        const cluster: KubernetesCluster = this.provisionCluster()
        this.provisionProject(domain, cluster)
    }

    private provisionDomain(): Domain {
        const domain = new DigitalOceanDomain()

        return new Domain('main-domain', {
            name: domain.name()
        })
    }

    private provisionCluster(): KubernetesCluster {
        const cluster = new DigitalOceanCluster()

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

    private provisionProject(domain: Domain, cluster: KubernetesCluster): Project {
        const project = new DigitalOceanProject()

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
}