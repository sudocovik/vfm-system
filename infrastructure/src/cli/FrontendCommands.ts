import { spawnSync } from 'child_process'

export class FrontendCommands {
  public static build (): void {
    const { status } = spawnSync('docker', ['build', '/frontend', '--target=development-environment', '--tag=covik/vfm-frontend:local'], {
      stdio: 'inherit',
      env: {
        DOCKER_BUILDKIT: '1'
      }
    })

    process.exitCode = status || -1
  }
}
