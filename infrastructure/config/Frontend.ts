import { Directory } from './'

export class Frontend {
  static rootFromHost = `${Directory.projectRootFromHost}/frontend`

  static mountRoot = '/frontend'

  static container = {
    image: {
      baseName: 'covik/vfm-frontend'
    },
    workingDirectory: '/app'
  }
}
