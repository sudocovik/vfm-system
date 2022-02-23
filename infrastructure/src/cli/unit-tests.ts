import { spawnSync } from 'child_process'

const unitTestsOnly = '.*(\\/+)__tests__\\/*\\/.+(\\.unit\\.)(ts|tsx|js)$'
const integrationTestsOnly = '.*(\\/+)__tests__\\/*\\/.+(\\.integration\\.)(ts|tsx|js)$'

export function unitTest (watch = false): number | null {
  const jestArguments: string[] = [
    unitTestsOnly,
    '--colors',
    '--verbose'
  ]
  if (watch) jestArguments.push('--watchAll')

  const { status } = spawnSync('jest', jestArguments, { stdio: 'inherit' })
  return status
}

export function integrationTest (): number | null {
  const jestArguments: string[] = [
    integrationTestsOnly,
    '--colors',
    '--verbose'
  ]

  const { status } = spawnSync('jest', jestArguments, { stdio: 'inherit' })
  return status
}
