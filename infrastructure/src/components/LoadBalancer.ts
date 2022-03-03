import * as digitalocean from '@pulumi/digitalocean'
import { Cluster, LoadBalancer } from '../../config'

export function createLoadBalancer () {
  return new digitalocean.LoadBalancer('primary-load-balancer', {
    name: LoadBalancer.title,
    region: LoadBalancer.region,
    size: LoadBalancer.size,
    dropletTag: Cluster.nodePool.tag,
    forwardingRules: []
  })
}
