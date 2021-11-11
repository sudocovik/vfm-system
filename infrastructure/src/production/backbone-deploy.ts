import { describeBackboneResources } from './backbone'
import {
    ClusterConfiguration,
    DomainConfiguration,
    LoadBalancerConfiguration,
    ProjectConfiguration,
} from './backbone-types'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { PulumiStackExecutor } from '../pulumi/StackExecutor'

export function deployBackboneResources(): void {
    const domainConfiguration: DomainConfiguration = {
        name: 'zarafleet.com'
    }

    const loadBalancerConfiguration: LoadBalancerConfiguration = {
        name: 'vfm',
        size: 'lb-small',
        region: 'fra1',
        ports: {
            http: {
                external: 80,
                internal: 32080
            },
            https: {
                external: 443,
                internal: 32080
            },
            teltonika: {
                external: 5027,
                internal: 32027
            }
        }
    }

    const clusterConfiguration: ClusterConfiguration = {
        name: 'vfm',
        region: 'fra1',
        version: '1.21.5-do.0',
        nodePool: {
            name: 'worker',
            size: 's-1vcpu-2gb',
            count: 1,
            tag: 'vfm-worker'
        },
        namespace: 'vfm',
        traefikVersion: '10.6.0',
        containerRegistryToken: process.env.CLUSTER_CONTAINER_REGISTRY_TOKEN || ''
    }

    const projectConfiguration: ProjectConfiguration = {
        name: 'VFM',
        description: 'Vehicle Fleet Management infrastructure',
        environment: 'Production',
        purpose: 'Web Application',
    }

    const apiToken: string = process.env.CLUSTER_TOKEN || ''

    new Program(
        new Stack('backbone-production', describeBackboneResources(
            domainConfiguration,
            loadBalancerConfiguration,
            clusterConfiguration,
            projectConfiguration,
            apiToken
        )),
        new PulumiStackExecutor()
    ).execute()
}