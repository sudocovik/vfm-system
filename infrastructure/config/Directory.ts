export class Directory {
  static projectRoot: string = process.env.PROJECT_ROOT ?? ''
  static cacheRoot = `${Directory.projectRoot}/.cache`
  static host = {
    frontend: `${process.env.HOST_PROJECT_ROOT}/frontend`
  }
}
