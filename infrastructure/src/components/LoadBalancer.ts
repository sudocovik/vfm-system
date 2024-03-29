import * as digitalocean from '@pulumi/digitalocean'
import { Cluster, LoadBalancer } from '../../config'

export function createLoadBalancer (certificate: digitalocean.Certificate) {
  return new digitalocean.LoadBalancer('primary-load-balancer', {
    name: LoadBalancer.title,
    region: LoadBalancer.region,
    size: LoadBalancer.size,
    dropletTag: Cluster.nodePool.tag,
    redirectHttpToHttps: true,
    algorithm: 'round_robin',
    forwardingRules: [
      {
        entryProtocol: 'http',
        targetProtocol: 'http',
        entryPort: LoadBalancer.ports.http.external,
        targetPort: LoadBalancer.ports.http.internal
      },
      {
        entryProtocol: 'https',
        targetProtocol: 'http',
        entryPort: LoadBalancer.ports.https.external,
        targetPort: LoadBalancer.ports.https.internal,
        certificateName: certificate.name
      },
      {
        entryProtocol: 'tcp',
        targetProtocol: 'tcp',
        entryPort: LoadBalancer.ports.teltonika.external,
        targetPort: LoadBalancer.ports.teltonika.internal
      }
    ],
    healthcheck: {
      port: LoadBalancer.ports.http.internal,
      protocol: 'http',
      path: '/',
      checkIntervalSeconds: 10,
      responseTimeoutSeconds: 5,
      unhealthyThreshold: 3,
      healthyThreshold: 3
    }
  })
}
