import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createCertificate } from '../Certificate'
import { Domain } from '../../../config'
import { createDomain } from '../Domain'

mockPulumiEngine()

describe('Certificate', () => {
  it('should have a unique resource ID', async () => {
    const certificate = createCertificate(createDomain())
    const urn = await outputOf(certificate.urn)

    expect(urn).toMatch(/certificate$/)
  })

  it('should certify primary domain and all of the subdomains', async () => {
    const certificate = createCertificate(createDomain())
    const domains = await outputOf(certificate.domains)

    const actualDomains = domains?.join(',')
    const expectedDomains = `${Domain.primary},*.${Domain.primary}`
    expect(actualDomains).toBe(expectedDomains)
  })

  it('should utilize lets_encrypt to handle certificate creation and renewal', async () => {
    const certificate = createCertificate(createDomain())
    const type = await outputOf(certificate.type)

    expect(type).toBe('lets_encrypt')
  })
})
