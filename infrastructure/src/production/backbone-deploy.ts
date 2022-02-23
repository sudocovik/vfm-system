import { describeBackboneResources } from './backbone'
import {
  ClusterConfiguration,
  DomainConfiguration,
  LoadBalancerConfiguration,
  ProjectConfiguration
} from './backbone-types'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { Cluster, Domain, Kubernetes, LoadBalancer, Project } from '../../config'

export function deployBackboneResources (): void {
  const domainConfiguration: DomainConfiguration = {
    name: Domain.primary
  }

  const loadBalancerConfiguration: LoadBalancerConfiguration = {
    name: LoadBalancer.title,
    size: LoadBalancer.size,
    region: LoadBalancer.region,
    ports: {
      http: {
        external: 80,
        internal: 32080
      },
      https: {
        external: 443,
        internal: 32080
      },
      teltonika: {
        external: 5027,
        internal: 32027
      }
    }
  }

  const clusterConfiguration: ClusterConfiguration = {
    name: Cluster.title,
    region: Cluster.region,
    version: Cluster.version,
    nodePool: {
      name: Cluster.nodePool.title,
      size: Cluster.nodePool.size,
      count: Cluster.nodePool.count,
      tag: Cluster.nodePool.tag
    },
    namespace: Kubernetes.namespace,
    traefikVersion: Kubernetes.traefikVersion,
    containerRegistryToken: Kubernetes.containerRegistryCredentials,
    tokenForKubeconfig: Cluster.readToken,
    kubeStateMetricsVersion: Kubernetes.kubeStateMetricsVersion
  }

  const projectConfiguration: ProjectConfiguration = {
    name: Project.nameUppercase,
    description: Project.description,
    environment: Project.environment,
    purpose: Project.purpose
  }

  Program.forStack(
    new Stack('backbone-production', describeBackboneResources(
      domainConfiguration,
      loadBalancerConfiguration,
      clusterConfiguration,
      projectConfiguration
    ))
  ).execute()
}
