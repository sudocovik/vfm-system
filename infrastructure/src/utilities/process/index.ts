export interface CustomProcess {
    run(callback: () => Promise<any>): Promise<void>
}