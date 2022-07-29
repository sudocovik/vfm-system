import { buildLocalImage, imageName, pushLocalImage } from '../'
import { DockerImage } from '../DockerImage'

jest.mock('../DockerImage')
const mockedImage = DockerImage as jest.Mock

describe('frontend', () => {
  describe('imageName', () => {
    it('should be non-empty string', () => {
      expect(typeof imageName).toBe('string')
      expect(imageName).not.toBe('')
    })
  })

  describe('- buildLocalImage()', () => {
    it('should build image and then sync node_modules', () => {
      const { build, syncNodeModules } = mockDockerImage()

      expect(DockerImage).not.toHaveBeenCalled()
      buildLocalImage()
      expect(DockerImage).toHaveBeenNthCalledWith(1, imageName)

      expect(build).toHaveBeenCalledTimes(1)
      expect(syncNodeModules).toHaveBeenCalledTimes(1)

      const buildInvocationOrder = build.mock.invocationCallOrder[0]
      const syncNodeModulesInvocationOrder = syncNodeModules.mock.invocationCallOrder[0]
      expect(syncNodeModulesInvocationOrder).toBeGreaterThan(buildInvocationOrder)
    })

    it.each([2, null])('should return result of image build() - %s', expectedResult => {
      const { build } = mockDockerImage()
      build.mockReturnValueOnce(expectedResult)

      const result = buildLocalImage()
      expect(result).toEqual(expectedResult)
    })

    it('should throw exception if build fails and do not sync node_modules', () => {
      const error = new Error('Failed to build image')

      const { build, syncNodeModules } = mockDockerImage()
      build.mockImplementation(() => {
        throw error
      })

      expect(() => buildLocalImage()).toThrow(error)
      expect(syncNodeModules).not.toHaveBeenCalled()
    })

    it('should throw exception if syncing node_modules fails', () => {
      const error = new Error('Failed to sync node_modules')

      const { syncNodeModules } = mockDockerImage()
      syncNodeModules.mockImplementation(() => {
        throw error
      })

      expect(() => buildLocalImage()).toThrow(error)
    })
  })

  describe('- pushLocalImage()', () => {
    it('should push image', () => {
      const { push } = mockDockerImage()

      expect(DockerImage).not.toHaveBeenCalled()
      pushLocalImage()
      expect(DockerImage).toHaveBeenNthCalledWith(1, imageName)

      expect(push).toHaveBeenCalledTimes(1)
    })

    it('should throw exception if push fails', () => {
      const error = new Error('Failed to push image')

      const { push } = mockDockerImage()
      push.mockImplementation(() => {
        throw error
      })

      expect(() => pushLocalImage()).toThrow(error)
    })
  })
})

function mockDockerImage () {
  const build = jest.fn()
  const syncNodeModules = jest.fn()
  const push = jest.fn()

  mockedImage.mockImplementationOnce(() => ({
    build,
    syncNodeModules,
    push
  }))

  return {
    build,
    syncNodeModules,
    push
  }
}
