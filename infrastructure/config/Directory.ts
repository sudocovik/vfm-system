export class Directory {
  static projectRoot: string = process.env.PROJECT_ROOT ?? ''
  static projectRootFromHost = process.env.HOST_PROJECT_ROOT ?? ''
  static cacheRoot = `${Directory.projectRoot}/.cache`
  static configRoot = `${Directory.projectRoot}/config`
}
