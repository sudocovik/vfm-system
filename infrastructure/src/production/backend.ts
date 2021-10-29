import provision from '../pulumi/provision'
import { DatabaseCluster, DatabaseDb, DatabaseFirewall, DatabaseUser } from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'

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

function describeBackendResources(): any {
    const backbone = new pulumi.StackReference('covik/vfm/backbone-production')
    const kubernetesClusterId = backbone.getOutput('clusterId')

    describeDatabase(kubernetesClusterId)
}

export function deployBackendResources(): void {
    provision('backend-production', async () => describeBackendResources())
}