import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'
import { createDomain } from '../components/Domain'
import { createCertificate } from '../components/Certificate'
import { createLoadBalancer } from '../components/LoadBalancer'
import { createWildcardSubdomain } from '../components/Subdomain'
import { createCluster } from '../components/Cluster'
import { createProject } from '../components/Project'
import { createKubernetesProvider } from '../components/KubernetesProvider'
import { createNamespace } from '../components/Namespace'
import { DockerCredentials } from '../components/DockerCredentials'
import { createTraefikIngressController } from '../components/TraefikIngressController'
import { createContainerRegistrySecret } from '../components/ContainerRegistrySecret'
import { Cluster, GitHubContainerRegistry } from '../../config'
import { Program } from '../pulumi/Program'
import { Stack } from '../pulumi/Stack'

export function generateKubeconfig (
  cluster: digitalocean.KubernetesCluster,
  user: pulumi.Input<string>,
  apiToken: pulumi.Input<string>
): pulumi.Output<string> {
  const clusterName = pulumi.interpolate`do-${cluster.region}-${cluster.name}`

  return pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.kubeConfigs[0].clusterCaCertificate}
    server: ${cluster.endpoint}
  name: ${clusterName}
contexts:
- context:
    cluster: ${clusterName}
    user: ${clusterName}-${user}
  name: ${clusterName}
current-context: ${clusterName}
kind: Config
users:
- name: ${clusterName}-${user}
  user:
    token: ${apiToken}
`
}

async function describeBackboneResources () {
  const domain = createDomain()
  const certificate = createCertificate(domain)
  const loadBalancer = createLoadBalancer(certificate)
  createWildcardSubdomain(domain, loadBalancer.ip)
  const cluster = createCluster()

  const kubeconfig = generateKubeconfig(cluster, 'admin', Cluster.readToken)
  const provider = createKubernetesProvider(kubeconfig, { parent: cluster })
  const namespace = createNamespace({ provider, parent: provider })
  const namespaceName = namespace.metadata.name
  createTraefikIngressController(namespaceName, { provider, parent: namespace })
  const dockerLogin = DockerCredentials.forRegistry(GitHubContainerRegistry.url).asUser(GitHubContainerRegistry.user).withPassword(GitHubContainerRegistry.password)
  const containerRegistryCredentials = createContainerRegistrySecret(dockerLogin, namespaceName, { provider, parent: namespace })

  createProject(domain, cluster, loadBalancer)

  return {
    kubeconfig,
    namespaceName,
    domainName: domain.name,
    containerRegistryCredentialsName: containerRegistryCredentials.metadata.name,
    clusterId: cluster.id
  }
}

export function deployBackboneResources (): void {
  Program.forStack(
    new Stack('backbone-production', describeBackboneResources)
  ).execute()
}
