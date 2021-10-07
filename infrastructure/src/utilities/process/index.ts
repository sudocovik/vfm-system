export interface CustomProcess {
    run(callback: () => Promise<any>): Promise<void>

    onGracefulShutdownRequest(action: () => Promise<void>): void
}