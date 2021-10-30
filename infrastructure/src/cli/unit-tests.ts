import { spawnSync } from 'child_process'

export function test(watch: boolean = false): number | null {
    let jestArguments: string[] = [
        '--colors',
        '--verbose'
    ]
    if (watch) jestArguments.push('--watchAll')

    const { status } = spawnSync('jest', jestArguments, { stdio: 'inherit' })
    return status
}