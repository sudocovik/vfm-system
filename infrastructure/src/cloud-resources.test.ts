import * as assert from 'assert'
import * as pulumi from '@pulumi/pulumi'

pulumi.runtime.setMocks({
    newResource: function(args: pulumi.runtime.MockResourceArgs): {id: string, state: any} {
        switch (args.type) {
            default:
                return {
                    id: args.inputs.name + "_id",
                    state: {
                        ...args.inputs,
                    },
                }
        }
    },
    call: function(args: pulumi.runtime.MockCallArgs) {
        switch (args.token) {
            default:
                return args;
        }
    },
})

jest.setTimeout(20000)

describe('#domain', () => {
    let pulumiProgram: typeof import('./pulumi-program')

    beforeAll(async () => {
        pulumiProgram = await import('./pulumi-program')

    })

    test('primary domain name should be zarafleet.com', async () => {
        expect.assertions(1);
        let domain = null
        await pulumiProgram.default(async () => domain = await import('./cloud-resources'))
        expect(domain).toEqual('Mark')
    })
})