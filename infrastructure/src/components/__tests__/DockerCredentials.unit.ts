import { DockerCredentials } from '../DockerCredentials'

describe('DockerCredentials', () => {
  it('should throw exception if registry URL is empty', () => {
    const factory = () => DockerCredentials.forRegistry('').toJSON()

    expect(factory).toThrow('Registry URL must not be empty')
  })

  it('should throw exception if username is empty', () => {
    const factory = () => DockerCredentials.forRegistry('unit-test').asUser('').toJSON()

    expect(factory).toThrow('Username must not be empty')
  })

  it('should throw exception if password is empty', () => {
    const factory = () => DockerCredentials.forRegistry('unit-test').asUser('jest').withPassword('').toJSON()

    expect(factory).toThrow('Password must not be empty')
  })

  it.each([
    { registryURL: 'ghcr.io', username: 'production', password: 'very-strong-ghcr-password', credentialsAsBase64: 'cHJvZHVjdGlvbjp2ZXJ5LXN0cm9uZy1naGNyLXBhc3N3b3Jk' },
    { registryURL: 'gcr.io', username: 'staging', password: 'very-strong-gcr-password', credentialsAsBase64: 'c3RhZ2luZzp2ZXJ5LXN0cm9uZy1nY3ItcGFzc3dvcmQ=' }
  ])('should return JSON with registry URL ($registryURL) as user ($username) authenticated with password ($password) following docker-config specification',
    ({ registryURL, username, password, credentialsAsBase64 }) => {
      const credentials = DockerCredentials.forRegistry(registryURL).asUser(username).withPassword(password).toJSON()

      const dockerConfigSpecification = removeNewLinesAndWhitespaces(`{
        "auths": {
          "${registryURL}": {
            "auth": "${credentialsAsBase64}"
          }
        }
      }`)

      expect(credentials).toEqual(dockerConfigSpecification)
    })
})

function removeNewLinesAndWhitespaces (text: string) {
  return text.replace(/\n|\s|\r/g, '')
}
