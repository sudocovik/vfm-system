import * as digitalocean from '@pulumi/digitalocean'
import * as pulumi from '@pulumi/pulumi'

export function createWildcardSubdomain (domain: digitalocean.Domain, ipAddress: pulumi.Output<string>) {
  return new digitalocean.DnsRecord('wildcard-subdomain', {
    name: '*',
    domain: domain.name,
    type: 'A',
    value: ipAddress
  }, {
    parent: domain
  })
}
