import { spawnSync } from 'child_process'

const unitTestsOnly = '.*(\\/+)__tests__\\/*\\/.+(\\.unit\\.)(ts|tsx|js)$'
const integrationTestsOnly = '.*(\\/+)__tests__\\/*\\/.+(\\.integration\\.)(ts|tsx|js)$'

export function unitTest(watch: boolean = false): number | null {
    let jestArguments: string[] = [
        unitTestsOnly,
        '--colors',
        '--verbose'
    ]
    if (watch) jestArguments.push('--watchAll')

    const { status } = spawnSync('jest', jestArguments, { stdio: 'inherit' })
    return status
}

export function integrationTest(): number | null {
    let jestArguments: string[] = [
        integrationTestsOnly,
        '--colors',
        '--verbose'
    ]

    const { status } = spawnSync('jest', jestArguments, { stdio: 'inherit' })
    return status
}