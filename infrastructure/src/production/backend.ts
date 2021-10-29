import provision from '../pulumi/provision'
import { DatabaseCluster } from '@pulumi/digitalocean'

function describeBackendResources(): any {
    new DatabaseCluster('main-backend-database', {
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
}

export function deployBackendResources(): void {
    provision('backend-production', async () => describeBackendResources())
}