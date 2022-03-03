import * as digitalocean from '@pulumi/digitalocean'
import { Cluster, LoadBalancer } from '../../config'

export function createLoadBalancer (certificate: digitalocean.Certificate) {
  return new digitalocean.LoadBalancer('primary-load-balancer', {
    name: LoadBalancer.title,
    region: LoadBalancer.region,
    size: LoadBalancer.size,
    dropletTag: Cluster.nodePool.tag,
    redirectHttpToHttps: true,
    forwardingRules: [
      {
        entryProtocol: 'http',
        targetProtocol: 'http',
        entryPort: LoadBalancer.ports.http.external,
        targetPort: LoadBalancer.ports.http.internal
      },
      {
        entryProtocol: 'https',
        targetProtocol: 'https',
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
    ]
  })
}
