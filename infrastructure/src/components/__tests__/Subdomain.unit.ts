import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createWildcardSubdomain } from '../Subdomain'
import { createDomain } from '../Domain'
import * as pulumi from '@pulumi/pulumi'
import { Output } from '@pulumi/pulumi'

mockPulumiEngine()

function subdomainFactory (ipAddress = '') {
  const primaryDomain = createDomain()
  const subdomain = createWildcardSubdomain(primaryDomain, Output.create(ipAddress))

  return {
    primaryDomain,
    subdomain
  }
}

describe('Subdomain', () => {
  it('should have a unique resource ID', async () => {
    const { subdomain } = subdomainFactory()

    const urn = await outputOf(subdomain.urn)
    expect(urn).toMatch(/wildcard-subdomain$/)
  })

  it('should include all subdomains of the primary domain', async () => {
    const { primaryDomain, subdomain } = subdomainFactory()

    const [domain, name, primaryDomainName] = await outputOf(pulumi.all([subdomain.domain, subdomain.name, primaryDomain.name]))

    const actualValue = `${name}.${domain}`
    const expectedValue = `*.${primaryDomainName}`
    expect(actualValue).toEqual(expectedValue)
  })

  it('should use a default ttl', async () => {
    const { subdomain } = subdomainFactory()

    const ttl = await outputOf(subdomain.ttl)
    expect(ttl).not.toBeDefined()
  })

  it('should be DNS A record', async () => {
    const { subdomain } = subdomainFactory()

    const type = await outputOf(subdomain.type)
    expect(type).toEqual('A')
  })

  it('should connect subdomain to a given IP address', async () => {
    const targetIpAddress = '127.0.0.1'
    const { subdomain } = subdomainFactory(targetIpAddress)

    const ip = await outputOf(subdomain.value)
    expect(ip).toEqual(targetIpAddress)
  })
})
