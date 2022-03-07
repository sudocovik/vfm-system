import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createCluster } from '../Cluster'
import { Cluster } from '../../../config'

mockPulumiEngine()

describe('Cluster', () => {
  it('should have a unique resource ID', async () => {
    const cluster = createCluster()

    const urn = await outputOf(cluster.urn)
    expect(urn).toMatch(/primary-cluster$/)
  })

  it('should have an explicit name', async () => {
    const cluster = createCluster()

    const name = await outputOf(cluster.name)
    expect(name).toEqual(Cluster.title)
  })

  it('should have a region', async () => {
    const cluster = createCluster()

    const region = await outputOf(cluster.region)
    expect(region).toEqual(Cluster.region)
  })

  it('should have a version', async () => {
    const cluster = createCluster()

    const version = await outputOf(cluster.version)
    expect(version).toEqual(Cluster.version)
  })

  it('should not be auto upgraded', async () => {
    const cluster = createCluster()

    const autoUpgrade = await outputOf(cluster.autoUpgrade)
    expect(autoUpgrade).toBeFalsy()
  })

  it('should not be highly available', async () => {
    const cluster = createCluster()

    const highlyAvailable = await outputOf(cluster.ha)
    expect(highlyAvailable).toBeFalsy()
  })

  describe('Node pool', () => {
    it('should have a name', async () => {
      const cluster = createCluster()

      const { name } = await outputOf(cluster.nodePool)
      expect(name).toEqual(Cluster.nodePool.title)
    })

    it('should have the cheapest droplet size', async () => {
      const cluster = createCluster()

      const { size } = await outputOf(cluster.nodePool)
      expect(size).toEqual('s-1vcpu-2gb')
    })

    it('should have a single droplet tag', async () => {
      const cluster = createCluster()

      const { tags } = await outputOf(cluster.nodePool)
      expect(tags).toHaveLength(1)

      const [tag] = <string[]>tags
      expect(tag).toEqual(Cluster.nodePool.tag)
    })

    it('should have a single node', async () => {
      const cluster = createCluster()

      const { nodeCount, autoScale, minNodes, maxNodes } = await outputOf(cluster.nodePool)
      expect(nodeCount).toEqual(1)
      expect(autoScale).toBeFalsy()
      expect(minNodes).not.toBeDefined()
      expect(maxNodes).not.toBeDefined()
    })

    it('should not have any taints', async () => {
      const cluster = createCluster()

      const { taints } = await outputOf(cluster.nodePool)
      expect(taints).not.toBeDefined()
    })
  })
})
