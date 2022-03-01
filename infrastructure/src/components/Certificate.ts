import * as digitalocean from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'

export function createCertificate (domain: digitalocean.Domain) {
  const allSubdomains = pulumi.interpolate`*.${domain.name}`

  return new digitalocean.Certificate('certificate', {
    domains: [
      domain.name,
      allSubdomains
    ],
    type: 'lets_encrypt'
  }, {
    parent: domain
  })
}
