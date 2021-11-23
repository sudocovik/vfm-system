export class Directory {
    static projectRoot: string = process.env.PROJECT_ROOT ?? ''
    static cacheRoot: string = `${Directory.projectRoot}/.cache`
}