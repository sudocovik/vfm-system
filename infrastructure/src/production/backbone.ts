import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'
import * as k8s from '@pulumi/kubernetes'
import { createDomain } from '../components/Domain'
import { createCertificate } from '../components/Certificate'
import { createLoadBalancer } from '../components/LoadBalancer'
import { createWildcardSubdomain } from '../components/Subdomain'
import { createCluster } from '../components/Cluster'
import { createProject } from '../components/Project'
import { Cluster, Kubernetes, LoadBalancer } from '../../config'
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

  createProject(domain, cluster, loadBalancer)

  const kubeconfig = generateKubeconfig(cluster, 'admin', Cluster.readToken)

  const provider: k8s.Provider = new k8s.Provider('kubernetes-provider', {
    kubeconfig
  }, {
    parent: cluster
  })

  const namespace = new k8s.core.v1.Namespace('primary-namespace', {
    metadata: {
      name: Kubernetes.namespace
    }
  }, {
    provider,
    parent: provider
  })

  const namespaceName = namespace.metadata.name

  new k8s.helm.v3.Chart('ingress-controller', {
    chart: 'traefik',
    version: Kubernetes.traefikVersion,
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
          nodePort: LoadBalancer.ports.http.internal
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
        auth: Buffer.from('covik:' + Kubernetes.containerRegistryCredentials).toString('base64')
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
    version: Kubernetes.kubeStateMetricsVersion,
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

export function deployBackboneResources (): void {
  Program.forStack(
    new Stack('backbone-production', describeBackboneResources)
  ).execute()
}
