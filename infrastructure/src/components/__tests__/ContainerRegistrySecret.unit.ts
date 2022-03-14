import * as k8s from '@pulumi/kubernetes'
import { mockPulumiEngine, outputOf } from '../../utilities/testing/pulumi'
import { createContainerRegistrySecret } from '../ContainerRegistrySecret'
import { DockerCredentials } from '../DockerCredentials'
import { output } from '@pulumi/pulumi'

mockPulumiEngine()

function containerRegistrySecretFactory () {
  const registryURL = 'unit-test'
  const username = 'irrelevant'
  const password = 'irrelevant-password'
  const credentials = DockerCredentials.forRegistry(registryURL).asUser(username).withPassword(password)
  const namespace = output('unit-test-namespace')

  return {
    credentials,
    namespace,
    secret: createContainerRegistrySecret(credentials, namespace)
  }
}

describe('ContainerRegistrySecret', () => {
  it('should have a unique resource ID', async () => {
    const { secret } = containerRegistrySecretFactory()

    const urn = await outputOf(secret.urn)
    expect(urn).toMatch(/container-registry-credentials$/)
  })

  it('should return a Kubernetes Secret', () => {
    const { secret } = containerRegistrySecretFactory()

    expect(secret).toBeInstanceOf(k8s.core.v1.Secret)
  })

  it('should have an explicit name', async () => {
    const { secret } = containerRegistrySecretFactory()

    const name = await outputOf(secret.metadata.name)
    expect(name).toEqual('container-registry')
  })

  it('should have a type', async () => {
    const { secret } = containerRegistrySecretFactory()

    const type = await outputOf(secret.type)
    expect(type).toEqual('kubernetes.io/dockerconfigjson')
  })

  it('should have a namespace', async () => {
    const { secret, namespace } = containerRegistrySecretFactory()

    const actualNamespace = await outputOf(secret.metadata.namespace)
    const expectedNamespace = await outputOf(namespace)

    expect(actualNamespace).toEqual(expectedNamespace)
  })

  it('should base64 encode credentials and set them as .dockerconfigjson data', async () => {
    const { secret, credentials } = containerRegistrySecretFactory()

    const actualDockerConfig = (await outputOf(secret.data))['.dockerconfigjson']
    const expectedDockerConfig = Buffer.from(credentials.toJSON()).toString('base64')

    expect(actualDockerConfig).toEqual(expectedDockerConfig)
  })
})
