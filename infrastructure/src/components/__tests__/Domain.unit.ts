import { createDomain } from '../Domain'
import * as pulumi from '@pulumi/pulumi'
import { Domain } from '../../../config'

pulumi.runtime.setMocks({
  newResource: function (args: pulumi.runtime.MockResourceArgs) {
    return {
      id: args.inputs.name + '_id',
      state: args.inputs
    }
  },
  call: function (args: pulumi.runtime.MockCallArgs) {
    return args.inputs
  }
})

function outputOf<T> (output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve))
}

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
