import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { DockerCredentials } from './DockerCredentials'

export function createContainerRegistrySecret (credentials: DockerCredentials, namespace: pulumi.Output<string>, opts?: pulumi.ResourceOptions) {
  const base64EncodedCredentials = Buffer.from(credentials.toJSON()).toString('base64')

  return new k8s.core.v1.Secret('container-registry-credentials', {
    metadata: {
      name: 'container-registry',
      namespace
    },
    type: 'kubernetes.io/dockerconfigjson',
    data: {
      '.dockerconfigjson': base64EncodedCredentials
    }
  }, opts)
}
