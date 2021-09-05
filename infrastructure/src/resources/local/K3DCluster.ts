import { Cluster } from '../../types/Cluster'

export class K3DCluster implements Cluster {
    name(): string {
        return 'vfm'
    }

    version(): string {
        return '1.21.2'
    }
}