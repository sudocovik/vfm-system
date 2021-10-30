import { spawnSync } from 'child_process'

export function test(watch: boolean = false): void {
    let jestArguments: string[] = [
        '--colors',
        '--verbose'
    ]
    if (watch) jestArguments.push('--watchAll')

    spawnSync('jest', jestArguments, { stdio: 'inherit' })
}