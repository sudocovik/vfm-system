import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createKubernetesProvider } from '../KubernetesProvider'

mockPulumiEngine()

describe('KubernetesProvider', () => {
  it('should have a unique resource ID', async () => {
    const provider = createKubernetesProvider('')

    const urn = await outputOf(provider.urn)
    expect(urn).toMatch(/kubernetes-provider$/)
  })
})
