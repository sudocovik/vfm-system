import { describeBackboneResources } from './backbone'
import {
    ClusterConfiguration,
    DomainConfiguration,
    LoadBalancerConfiguration,
    ProjectConfiguration,
} from './backbone-types'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { Domain, LoadBalancer, Project } from '../../config'

export function deployBackboneResources(): void {
    const domainConfiguration: DomainConfiguration = {
        name: Domain.primary
    }

    const loadBalancerConfiguration: LoadBalancerConfiguration = {
        name: LoadBalancer.title,
        size: LoadBalancer.size,
        region: LoadBalancer.region,
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
        name: Project.nameUppercase,
        description: Project.description,
        environment: Project.environment,
        purpose: Project.purpose,
    }

    const apiToken: string = process.env.CLUSTER_TOKEN || ''

    Program.forStack(
        new Stack('backbone-production', describeBackboneResources(
            domainConfiguration,
            loadBalancerConfiguration,
            clusterConfiguration,
            projectConfiguration,
            apiToken
        ))
    ).execute()
}