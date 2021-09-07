import type { Cluster } from '../../types/Cluster'

export class DigitalOceanCluster implements Cluster {
    name(): string {
        return 'vfm'
    }

    version(): string {
        return '1.21.2-do.2'
    }
}