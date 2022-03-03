import * as pulumi from '@pulumi/pulumi'

type Args = pulumi.runtime.MockResourceArgs

export function mockPulumiEngine () {
  pulumi.runtime.setMocks({
    newResource: (args: Args) => {
      switch (args.type) {
        case 'digitalocean:index/certificate:Certificate':
          return mockCertificateName(args)

        default:
          return {
            id: args.inputs.name + '_id',
            state: args.inputs
          }
      }
    },
    call: (args: pulumi.runtime.MockCallArgs) => args.inputs
  })
}

export function outputOf<T> (output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve))
}

function mockCertificateName (args: Args) {
  return {
    id: args.inputs.name + '_id',
    state: {
      ...args.inputs,
      name: 'mocked-certificate-name'
    }
  }
}
