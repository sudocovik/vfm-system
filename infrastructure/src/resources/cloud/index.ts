import { Domain, Project, KubernetesCluster, DropletSlug } from '@pulumi/digitalocean'
import { DigitalOceanCluster } from './DigitalOceanCluster'

export default class {
    public provisionAll(): void {
        const domain: Domain = this.provisionDomain()
        const cluster: KubernetesCluster = this.provisionCluster()
        this.provisionProject(domain, cluster)
    }

    private provisionDomain(): Domain {
        return new Domain('main-domain', {
            name: 'zarafleet.com'
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
        return new Project('main-project', {
            name: 'VFM',
            environment: 'Production',
            description: 'Vehicle Fleet Management infrastructure',
            purpose: 'Web Application',
            resources: [
                domain.domainUrn,
                cluster.clusterUrn
            ]
        })
    }
}