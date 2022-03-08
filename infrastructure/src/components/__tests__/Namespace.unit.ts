import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createNamespace } from '../Namespace'
import { Kubernetes } from '../../../config'

mockPulumiEngine()

describe('Namespace', () => {
  it('should have a unique resource ID', async () => {
    const namespace = createNamespace()

    const urn = await outputOf(namespace.urn)
    expect(urn).toMatch(/primary-namespace$/)
  })

  it('should have a name', async () => {
    const namespace = createNamespace()

    const name = await outputOf(namespace.metadata.name)
    expect(name).toEqual(Kubernetes.namespace)
  })
})
