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
    traefikVersion: string
    containerRegistryToken: string
    tokenForKubeconfig: string
    kubeStateMetricsVersion: string
}

export type ProjectConfiguration = {
    name: string
    description: string
    purpose: string
    environment: string
}
