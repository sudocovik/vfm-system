import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Kubernetes, LoadBalancer } from '../../config'

export function createTraefikIngressController (namespace: pulumi.Output<string>, opts?: pulumi.ResourceOptions) {
  return new k8s.helm.v3.Chart('ingress-controller', {
    chart: 'traefik',
    version: Kubernetes.traefikVersion,
    fetchOpts: {
      repo: 'https://helm.traefik.io/traefik'
    },
    namespace,
    values: {
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
      },
      ingressRoute: {
        dashboard: {
          enabled: false
        }
      }
    },
    transformations: [
      obj => {
        if (obj.kind === 'Service') obj.metadata.namespace = namespace
      },

      obj => {
        if (obj.kind === 'Service') {
          obj.metadata.annotations = {
            'kubernetes.digitalocean.com/firewall-managed': 'false'
          }
        }
      }
    ]
  }, opts)
}
