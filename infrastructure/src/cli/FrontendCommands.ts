import { buildLocalImage } from '../local-environment/frontend'

export class FrontendCommands {
  public static build (): void {
    const status = buildLocalImage()

    process.exitCode = status ?? -1
  }
}
