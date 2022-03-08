import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { Kubernetes } from '../../config'

export function createNamespace (opts?: pulumi.ResourceOptions) {
  return new k8s.core.v1.Service('primary-namespace', {
    metadata: {
      name: Kubernetes.namespace
    }
  }, opts)
}
