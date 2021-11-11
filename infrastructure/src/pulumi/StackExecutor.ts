import { Stack } from './Stack'

export interface StackExecutor {
    select(stack: Stack): Promise<void>
}