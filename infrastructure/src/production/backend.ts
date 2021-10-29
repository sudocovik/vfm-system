import provision from '../pulumi/provision'
import { DatabaseCluster, DatabaseFirewall, DatabaseUser } from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'

function describeBackendResources(): any {
    const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
    const kubernetesClusterId = backbone.getOutput('clusterId')

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
            value: kubernetesClusterId
        }]
    })

    new DatabaseUser('main-database-user', {
        clusterId: cluster.id,
        name: 'regular'
    })
}

export function deployBackendResources(): void {
    provision('backend-production', async () => describeBackendResources())
}