import * as digitalocean from '@pulumi/digitalocean'
import { Project } from '../../config'

export function createProject (
  domain: digitalocean.Domain,
  cluster: digitalocean.KubernetesCluster,
  loadBalancer: digitalocean.LoadBalancer
) {
  // does not affect production in any way, so it has no tests
  return new digitalocean.Project('primary-project', {
    name: Project.nameUppercase,
    environment: Project.environment,
    description: Project.description,
    purpose: Project.purpose,
    resources: [
      domain.domainUrn,
      cluster.clusterUrn,
      loadBalancer.loadBalancerUrn
    ]
  })
}
