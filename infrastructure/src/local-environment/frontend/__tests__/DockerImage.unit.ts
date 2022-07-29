import { DockerImage } from '../DockerImage'
import { execSync, spawnSync } from 'child_process'
import { Frontend } from '../../../../config'
import { renameSync, rmSync } from 'fs'

jest.mock('child_process')
jest.mock('fs')

describe('DockerImage', () => {
  describe('- build()', () => {
    beforeEach(() => simulateSpawnSyncResult({ status: 0 }))

    it('should run "docker build" command', () => {
      const image = new DockerImage('')

      expect(spawnSync).not.toHaveBeenCalled()
      image.build()
      expect(spawnSync).toHaveBeenCalledTimes(1)

      const { command, commandArguments } = getSpawnSyncArguments()
      const fullCommand = `${command} ${commandArguments[0]}`
      expect(fullCommand).toEqual('docker build')
    })

    it('should use Docker BuildKit', () => {
      const image = new DockerImage('')

      image.build()

      const { options } = getSpawnSyncArguments()
      expect(options.env).toEqual(expect.objectContaining({ DOCKER_BUILDKIT: '1' }))
    })

    it(`should set build context to ${Frontend.mountRoot}`, () => {
      const image = new DockerImage('')

      image.build()

      const { commandArguments } = getSpawnSyncArguments()
      const buildContext = commandArguments[1]
      expect(buildContext).toEqual(Frontend.mountRoot)
    })

    it('should target development environment', () => {
      const image = new DockerImage('')

      image.build()

      const { commandArguments } = getSpawnSyncArguments()
      expect(commandArguments).toEqual(expect.arrayContaining(['--target=development-environment']))
    })

    it('should tag built image with name passed to constructor argument', () => {
      const image = new DockerImage('my-docker-image:latest')

      image.build()

      const { commandArguments } = getSpawnSyncArguments()
      expect(commandArguments).toEqual(expect.arrayContaining(['--tag=my-docker-image:latest']))
    })

    it('should inherit stdout and stderr from parent process', () => {
      const image = new DockerImage('')

      image.build()

      const { options } = getSpawnSyncArguments()
      expect(options).toEqual(expect.objectContaining({ stdio: 'inherit' }))
    })

    it('should throw exception if spawnSync\'s error is not undefined', () => {
      const error = 'Random error'

      const image = new DockerImage('')

      simulateSpawnSyncResult({ error })
      expect(() => image.build()).toThrow(error)

      simulateSpawnSyncResult({ error: '' })
      expect(() => image.build()).not.toThrow()
    })

    it('should return status code if one exists', () => {
      const image = new DockerImage('')

      simulateSpawnSyncResult({ status: 1 })
      expect(image.build()).toEqual(1)

      simulateSpawnSyncResult({ status: null })
      expect(image.build()).toEqual(null)
    })
  })

  describe('- syncNodeModules()', () => {
    it('should rename host node_modules to node_modules_old', () => {
      const image = new DockerImage('')

      expect(renameSync).not.toHaveBeenCalled()
      image.syncNodeModules()
      expect(renameSync).toHaveBeenNthCalledWith(1, `${Frontend.mountRoot}/node_modules`, `${Frontend.mountRoot}/node_modules_old`)
    })

    it('should create docker container, copy node_modules from container to host and remove container', () => {
      const image = new DockerImage('test-image')
      const containerId = '1234567  '
      const containerIdTrimmed = '1234567'

      simulateExecSyncResult(containerId)
      expect(execSync).not.toHaveBeenCalled()
      image.syncNodeModules()

      expect(execSync).toHaveBeenNthCalledWith(1, 'docker create test-image', { encoding: 'utf-8' })
      expect(execSync).toHaveNthReturnedWith(1, containerId)

      expect(execSync).toHaveBeenNthCalledWith(2, `docker cp ${containerIdTrimmed}:${Frontend.container.workingDirectory}/node_modules ${Frontend.mountRoot}/.`)
      expect(execSync).toHaveBeenNthCalledWith(3, `docker rm ${containerIdTrimmed}`)
    })

    it('should remove node_modules_old if everything went smooth', () => {
      const image = new DockerImage('')

      expect(rmSync).not.toHaveBeenCalled()
      image.syncNodeModules()
      assertNodeModulesOldWereRemoved()
    })

    describe('Failures', () => {
      test('if node_modules does not exist rename should not throw exception', () => {
        const image = new DockerImage('')

        simulateNodeModulesRenameFailure()
        expect(() => image.syncNodeModules()).not.toThrow()
      })

      test.each([
        { name: 'if docker create fails revert node_modules_old to node_modules', action: simulateDockerCreateFailure },
        { name: 'if docker cp fails revert node_modules_old to node_modules', action: simulateDockerCpFailure }
      ])('$name', ({ action }) => {
        const image = new DockerImage('test-image')

        simulateNodeModulesRenameFailure()
        action()

        expect(() => image.syncNodeModules()).toThrow()
        assertNodeModulesOldHasBeenRevertedToNodeModules()
      })

      test('if docker cp fails remove container and throw exception', () => {
        const image = new DockerImage('test-image')

        simulateDockerCpFailure()

        expect(() => image.syncNodeModules()).toThrow()
        expect(execSync).toHaveBeenNthCalledWith(3, expect.stringContaining('docker rm'))
      })

      it('should throw exception when docker rm fails and remove node_modules_old', () => {
        const image = new DockerImage('test-image')

        simulateDockerRmFailure()
        simulateNodeModulesOldRemoveFailure()

        expect(() => image.syncNodeModules()).toThrow(new Error('Failed to remove docker container'))
        assertNodeModulesOldWereRemoved()
      })

      it('should not throw exception when removing missing node_modules_old', () => {
        const image = new DockerImage('test-image')

        simulateNodeModulesOldRemoveFailure()

        expect(() => image.syncNodeModules()).not.toThrow()
      })
    })
  })

  describe('- push()', () => {
    it('should throw exception if command fails', () => {
      const image = new DockerImage('test-image')

      simulateDockerPushFailure()

      expect(() => image.push()).toThrow()
    })

    it('should use execSync to push image', () => {
      const image = new DockerImage('test-image')

      expect(execSync).not.toHaveBeenCalled()
      image.push()
      expect(execSync).toHaveBeenNthCalledWith(1, 'docker push test-image')
    })
  })
})

function getSpawnSyncArguments () {
  const spawnSyncMock = spawnSync as jest.Mock

  const command = spawnSyncMock.mock.calls[0][0]
  const commandArguments = spawnSyncMock.mock.calls[0][1]
  const options = spawnSyncMock.mock.calls[0][2]

  return { command, commandArguments, options }
}

function simulateSpawnSyncResult (result: Record<string, unknown>) {
  (spawnSync as jest.Mock).mockReturnValue(result)
}

function simulateExecSyncResult (result: unknown) {
  (execSync as jest.Mock).mockReturnValue(result)
}

function simulateNodeModulesRenameFailure () {
  (renameSync as jest.Mock).mockImplementation(() => {
    throw new Error('node_modules does not exist')
  })
}

function simulateDockerCreateFailure () {
  (execSync as jest.Mock).mockImplementation(command => {
    if (command.toString().startsWith('docker create')) throw new Error('Failed to create docker container')
  })
}

function simulateDockerCpFailure () {
  (execSync as jest.Mock).mockImplementation(command => {
    if (command.toString().startsWith('docker cp')) throw new Error('Failed to copy files from docker container')
  })
}

function simulateDockerRmFailure () {
  (execSync as jest.Mock).mockImplementation(command => {
    if (command.toString().startsWith('docker rm')) throw new Error('Failed to remove docker container')
  })
}

function assertNodeModulesOldHasBeenRevertedToNodeModules () {
  expect(renameSync).toHaveBeenNthCalledWith(2, `${Frontend.mountRoot}/node_modules_old`, `${Frontend.mountRoot}/node_modules`)
}

function simulateNodeModulesOldRemoveFailure () {
  (rmSync as jest.Mock).mockImplementation(() => {
    throw new Error('node_modules_old does not exist')
  })
}

function assertNodeModulesOldWereRemoved () {
  expect(rmSync).toHaveBeenNthCalledWith(1, `${Frontend.mountRoot}/node_modules_old`, { recursive: true, force: true })
}

function simulateDockerPushFailure () {
  (execSync as jest.Mock).mockImplementation(image => {
    throw new Error('Failed to push docker image ' + image)
  })
}
