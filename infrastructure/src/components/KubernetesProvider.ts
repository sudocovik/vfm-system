import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'

export function createKubernetesProvider (kubeconfig: pulumi.Input<string>, opts?: pulumi.ResourceOptions) {
  return new k8s.Provider('kubernetes-provider', {
    kubeconfig
  }, opts)
}
