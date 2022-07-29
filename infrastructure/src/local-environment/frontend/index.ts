import { DockerImage } from './DockerImage'
import { Frontend } from '../../../config'

export const imageName = `localhost:5000/${Frontend.container.image.baseName}:latest`

export function buildLocalImage (): ReturnType<DockerImage['build']> {
  const image = new DockerImage(imageName)

  const buildResult = image.build()
  image.syncNodeModules()

  return buildResult
}

export function pushLocalImage () {
  const image = new DockerImage(imageName)
  image.push()
}
