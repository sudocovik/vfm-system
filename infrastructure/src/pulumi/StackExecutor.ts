import { Stack } from './Stack'

export interface StackExecutor {
    select(stack: Stack): Promise<void>

    installPlugins(): Promise<void>

    refreshState(): Promise<void>

    deployResources(): Promise<void>
}