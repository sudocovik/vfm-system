export interface LocalCluster {
    name (): string

    kubeconfig (): string

    create (): void

    start (): void

    stop (): void

    destroy (): void
}