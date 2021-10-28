import { spawn } from 'child_process'

export function test(watch: boolean = false): void {
    let jestArguments: string[] = [
        '--colors',
        '--verbose'
    ]
    if (watch) jestArguments.push('--watchAll')

    spawn('jest', jestArguments, { stdio: 'inherit' })
}