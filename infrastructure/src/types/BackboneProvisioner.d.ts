import { Cluster } from './Cluster'

export interface BackboneProvisioner {
    provision(): Cluster
}