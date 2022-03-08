import { describeBackboneResources } from './backbone'
import {
  ClusterConfiguration,
  ProjectConfiguration
} from './backbone-types'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { Cluster, Kubernetes, Project } from '../../config'

export function deployBackboneResources (): void {
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
      clusterConfiguration,
      projectConfiguration
    ))
  ).execute()
}
