import type {
  ClusterConfiguration,
  DomainConfiguration,
  LoadBalancerConfiguration,
  ProjectConfiguration
} from './backbone-types'
import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'
import * as k8s from '@pulumi/kubernetes'
import { createDomain } from '../components/Domain'
import { createCertificate } from '../components/Certificate'
import { createWildcardSubdomain } from '../components/Subdomain'
import { createCluster } from '../components/Cluster'

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

export const describeBackboneResources = (
  domainConfiguration: DomainConfiguration,
  loadBalancerConfiguration: LoadBalancerConfiguration,
  clusterConfiguration: ClusterConfiguration,
  projectConfiguration: ProjectConfiguration
) => async () => {
  const domain = createDomain()
  const certificate = createCertificate(domain)
  const loadBalancer = createLoadBalancer(certificate)
  createWildcardSubdomain(domain, loadBalancer.ip)
  const cluster = createCluster()

  new digitalocean.Project('primary-project', {
    name: projectConfiguration.name,
    environment: projectConfiguration.environment,
    description: projectConfiguration.description,
    purpose: projectConfiguration.purpose,
    resources: [
      domain.domainUrn,
      cluster.clusterUrn,
      loadBalancer.loadBalancerUrn
    ]
  })

  const kubeconfig = generateKubeconfig(cluster, 'admin', clusterConfiguration.tokenForKubeconfig)

  const provider: k8s.Provider = new k8s.Provider('kubernetes-provider', {
    kubeconfig
  }, {
    parent: cluster
  })

  const namespace = new k8s.core.v1.Namespace('primary-namespace', {
    metadata: {
      name: clusterConfiguration.namespace
    }
  }, {
    provider,
    parent: provider
  })

  const namespaceName = namespace.metadata.name

  new k8s.helm.v3.Chart('ingress-controller', {
    chart: 'traefik',
    version: clusterConfiguration.traefikVersion,
    fetchOpts: {
      repo: 'https://helm.traefik.io/traefik'
    },
    namespace: namespaceName,
    values: {
      ingressRoute: {
        dashboard: {
          enabled: false
        }
      },
      service: {
        type: 'NodePort'
      },
      ports: {
        web: {
          nodePort: loadBalancerConfiguration.ports.http.internal
        },
        websecure: {
          expose: false
        }
      }
    },
    transformations: [
      obj => {
        if (obj.kind === 'Service') {
          obj.metadata.namespace = namespaceName
          obj.metadata.annotations = {
            'kubernetes.digitalocean.com/firewall-managed': 'false'
          }
        }
      }
    ]
  }, {
    provider,
    parent: namespace
  })

  const dockerLogin = {
    auths: {
      'ghcr.io': {
        auth: Buffer.from('covik:' + clusterConfiguration.containerRegistryToken).toString('base64')
      }
    }
  }
  const containerRegistryCredentials = new k8s.core.v1.Secret('container-registry-credentials', {
    metadata: {
      namespace: namespaceName,
      name: 'container-registry'
    },
    type: 'kubernetes.io/dockerconfigjson',
    data: {
      '.dockerconfigjson': Buffer.from(JSON.stringify(dockerLogin), 'utf8').toString('base64')
    }
  }, {
    provider,
    parent: namespace
  })

  new k8s.helm.v3.Chart('kube-state-metrics', {
    chart: 'kube-state-metrics',
    version: clusterConfiguration.kubeStateMetricsVersion,
    fetchOpts: {
      repo: 'https://prometheus-community.github.io/helm-charts'
    },
    namespace: 'kube-system'
  }, {
    provider,
    parent: namespace
  })

  return {
    kubeconfig,
    namespaceName,
    domainName: domain.name,
    containerRegistryCredentialsName: containerRegistryCredentials.metadata.name,
    clusterId: cluster.id
  }
}
