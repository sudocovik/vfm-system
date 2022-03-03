import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createLoadBalancer } from '../LoadBalancer'
import { Cluster, Kubernetes, LoadBalancer } from '../../../config'

mockPulumiEngine()

describe('LoadBalancer', () => {
  it('should have a unique resource ID', async () => {
    const loadBalancer = createLoadBalancer()

    const urn = await outputOf(loadBalancer.urn)
    expect(urn).toMatch(/primary-load-balancer$/)
  })

  it('should have an explicit name', async () => {
    const loadBalancer = createLoadBalancer()

    const name = await outputOf(loadBalancer.name)
    expect(name).toEqual(LoadBalancer.title)
  })

  it('should have a region', async () => {
    const loadBalancer = createLoadBalancer()

    const region = await outputOf(loadBalancer.region)
    expect(region).toEqual(LoadBalancer.region)
  })

  it('should have a size', async () => {
    const loadBalancer = createLoadBalancer()

    const size = await outputOf(loadBalancer.size)
    expect(size).toEqual(LoadBalancer.size)
  })

  it('should route traffic to cluster droplets', async () => {
    const loadBalancer = createLoadBalancer()

    const dropletTag = await outputOf(loadBalancer.dropletTag)
    expect(dropletTag).toEqual(Cluster.nodePool.tag)
  })
})
