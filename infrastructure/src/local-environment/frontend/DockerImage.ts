import { execSync, spawnSync } from 'child_process'
import { Frontend } from '../../../config'
import { renameSync, rmSync } from 'fs'

type StatusCode = ReturnType<typeof spawnSync>['status']

export class DockerImage {
  public constructor (
    private _fullImageName: string
  ) {
  }

  public build (): StatusCode {
    const result = spawnSync('docker', [
      'build',
      Frontend.mountRoot,
      '--target=development-environment',
      `--tag=${this._fullImageName}`
    ], {
      stdio: 'inherit',
      env: {
        DOCKER_BUILDKIT: '1'
      }
    })

    if (result?.error) throw result.error

    return result.status
  }

  public syncNodeModules (): void {
    this._backupNodeModules()

    const containerId = this._revertNodeModulesOnFailure(this._createDockerContainer.bind(this))?.trim()

    let dockerRmHasFailed
    try {
      this._revertNodeModulesOnFailure(this._copyNodeModulesFromContainerToHost(containerId))
    } finally {
      dockerRmHasFailed = this._removeDockerContainer(containerId)
    }

    this._removeNodeModulesBackup()

    if (dockerRmHasFailed) throw dockerRmHasFailed
  }

  public push () {
    execSync(`docker push ${this._fullImageName}`)
  }

  private _backupNodeModules () {
    try {
      renameSync(`${Frontend.mountRoot}/node_modules`, `${Frontend.mountRoot}/node_modules_old`)
    } catch (e) { }
  }

  private _revertNodeModulesOnFailure <T> (action: () => T): T {
    try {
      return action()
    } catch (e) {
      try {
        renameSync(`${Frontend.mountRoot}/node_modules_old`, `${Frontend.mountRoot}/node_modules`)
      } catch (e) { }

      throw e
    }
  }

  private _removeNodeModulesBackup () {
    try {
      rmSync(`${Frontend.mountRoot}/node_modules_old`, { recursive: true, force: true })
    } catch (e) { }
  }

  private _createDockerContainer () {
    return execSync(`docker create ${this._fullImageName}`, { encoding: 'utf-8' })
  }

  private _copyNodeModulesFromContainerToHost (containerId: string) {
    return () => execSync(`docker cp ${containerId}:${Frontend.container.workingDirectory}/node_modules ${Frontend.mountRoot}/.`)
  }

  private _removeDockerContainer (containerId: string) {
    let dockerRmHasFailed
    try {
      execSync(`docker rm ${containerId}`)
    } catch (e) {
      dockerRmHasFailed = e
    }

    return dockerRmHasFailed
  }
}
