export interface LocalCluster {
    create(): Promise<void>

    destroy(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    stop(): Promise<void>

    kubeconfig(): Promise<string>
}