import * as digitalocean from '@pulumi/digitalocean'

export const domain: digitalocean.Domain = new digitalocean.Domain('primary-domain', {
    name: 'zarafleet.com'
})