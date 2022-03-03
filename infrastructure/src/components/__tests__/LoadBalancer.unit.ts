import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createLoadBalancer } from '../LoadBalancer'
import { Cluster, LoadBalancer } from '../../../config'
import { createCertificate } from '../Certificate'
import { createDomain } from '../Domain'

mockPulumiEngine()

function loadBalancerFactory () {
  const certificate = createCertificate(createDomain())
  const loadBalancer = createLoadBalancer(certificate)

  return {
    certificate,
    loadBalancer
  }
}

describe('LoadBalancer', () => {
  it('should have a unique resource ID', async () => {
    const { loadBalancer } = loadBalancerFactory()

    const urn = await outputOf(loadBalancer.urn)
    expect(urn).toMatch(/primary-load-balancer$/)
  })

  it('should have an explicit name', async () => {
    const { loadBalancer } = loadBalancerFactory()

    const name = await outputOf(loadBalancer.name)
    expect(name).toEqual(LoadBalancer.title)
  })

  it('should have a region', async () => {
    const { loadBalancer } = loadBalancerFactory()

    const region = await outputOf(loadBalancer.region)
    expect(region).toEqual(LoadBalancer.region)
  })

  it('should have a size', async () => {
    const { loadBalancer } = loadBalancerFactory()

    const size = await outputOf(loadBalancer.size)
    expect(size).toEqual(LoadBalancer.size)
  })

  it('should route traffic to cluster droplets', async () => {
    const { loadBalancer } = loadBalancerFactory()

    const dropletTag = await outputOf(loadBalancer.dropletTag)
    expect(dropletTag).toEqual(Cluster.nodePool.tag)
  })

  describe('Rules', () => {
    it('should have only 3 rules', async () => {
      const { loadBalancer } = loadBalancerFactory()

      const rules = await outputOf(loadBalancer.forwardingRules)
      expect(rules).toHaveLength(3)
    })

    it('should route HTTP traffic', async () => {
      const { loadBalancer } = loadBalancerFactory()

      const rules = await outputOf(loadBalancer.forwardingRules)
      const httpRule = rules.find(rule => rule.entryProtocol === 'http' && rule.targetProtocol === 'http')
      expect(httpRule).toBeDefined()

      expect(httpRule?.entryPort).toEqual(LoadBalancer.ports.http.external)
      expect(httpRule?.targetPort).toEqual(LoadBalancer.ports.http.internal)
    })

    it('should route HTTPS traffic', async () => {
      const { certificate, loadBalancer } = loadBalancerFactory()

      const rules = await outputOf(loadBalancer.forwardingRules)
      const httpsRule = rules.find(rule => rule.entryProtocol === 'https' && rule.targetProtocol === 'https')
      expect(httpsRule).toBeDefined()

      expect(httpsRule?.entryPort).toEqual(LoadBalancer.ports.https.external)
      expect(httpsRule?.targetPort).toEqual(LoadBalancer.ports.https.internal)

      const certificateName = await outputOf(certificate.name)
      expect(httpsRule?.certificateName).toBeDefined()
      expect(httpsRule?.certificateName).toEqual(certificateName)
    })

    it('should route TCP traffic from Teltonika GPS devices', async () => {
      const { loadBalancer } = loadBalancerFactory()

      const rules = await outputOf(loadBalancer.forwardingRules)
      const teltonikaRule = rules.find(rule => rule.entryProtocol === 'tcp' && rule.targetProtocol === 'tcp')
      expect(teltonikaRule).toBeDefined()
      expect(teltonikaRule?.entryPort).toEqual(LoadBalancer.ports.teltonika.external)
      expect(teltonikaRule?.targetPort).toEqual(LoadBalancer.ports.teltonika.internal)
    })

    it('should redirect HTTP traffic to HTTPS', async () => {
      const { loadBalancer } = loadBalancerFactory()

      const redirectHttpToHttps = await outputOf(loadBalancer.redirectHttpToHttps)
      expect(redirectHttpToHttps).toBe(true)
    })
  })
})
