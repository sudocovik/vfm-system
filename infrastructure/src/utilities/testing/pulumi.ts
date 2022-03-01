import * as pulumi from '@pulumi/pulumi'

export function mockPulumiEngine () {
  pulumi.runtime.setMocks({
    newResource: (args: pulumi.runtime.MockResourceArgs) => ({
      id: args.inputs.name + '_id',
      state: args.inputs
    }),
    call: (args: pulumi.runtime.MockCallArgs) => args.inputs
  })
}

export function outputOf<T> (output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve))
}
