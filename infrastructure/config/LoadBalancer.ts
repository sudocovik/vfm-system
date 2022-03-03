import { Project } from './Project'

export class LoadBalancer {
  public static title: string = Project.nameLowercase
  public static region: string = Project.region
  public static size = 'lb-small'
  public static ports = {
    http: {
      external: 80,
      internal: 32080
    },
    https: {
      external: 443,
      internal: 32080
    },
    teltonika: {
      external: 5027,
      internal: 32027
    }
  }
}
