import * as digitalocean from '@pulumi/digitalocean'
import { Domain } from '../../config'

export function createDomain () {
  return new digitalocean.Domain('primary-domain', {
    name: Domain.primary
  })
}
