export type DomainConfiguration = {
    name: string
}

type SinglePort = {
    external: number,
    internal: number
}

type Ports = {
    http: SinglePort
    https: SinglePort
    teltonika: SinglePort
}

export type LoadBalancerConfiguration = {
    size: string
    region: string
    ports: Ports
}

type NodePool = {
    name: string
    size: string
    count: number
    tag: string
}

export type ClusterConfiguration = {
    name: string
    version: string
    region: string
    nodePool: NodePool
    namespace: string
}

export type ProjectConfiguration = {
    name: string
    description: string
    purpose: string
    environment: string
}