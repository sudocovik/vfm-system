import { createDomain } from '../Domain'
import { Domain } from '../../../config'
import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'

mockPulumiEngine()

describe('Domain', () => {
  it('should have a unique resource ID', async () => {
    const domain = createDomain()

    const urn = await outputOf(domain.urn)
    expect(urn).toMatch(/primary-domain$/)
  })

  it('should not have an IP address directly associated with it', async () => {
    const domain = createDomain()

    const ipAddress = await outputOf(domain.ipAddress)
    expect(ipAddress).not.toBeDefined()
  })

  it('should have a name', async () => {
    const domain = createDomain()

    const name = await outputOf(domain.name)
    expect(name).toBe(Domain.primary)
  })
})
