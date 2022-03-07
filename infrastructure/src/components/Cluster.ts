import * as digitalocean from '@pulumi/digitalocean'
import { Cluster } from '../../config'

export function createCluster () {
  return new digitalocean.KubernetesCluster('primary-cluster', {
    name: Cluster.title,
    region: Cluster.region,
    version: Cluster.version,
    autoUpgrade: false,
    nodePool: {
      name: Cluster.nodePool.title,
      size: Cluster.nodePool.size,
      tags: [Cluster.nodePool.tag],
      nodeCount: Cluster.nodePool.count,
      autoScale: false
    }
  })
}
