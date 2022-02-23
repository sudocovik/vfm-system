import { Project } from './Project'
import { Kubernetes } from './Kubernetes'

export class Cluster {
    public static title: string = Project.nameLowercase
    public static version = `${Kubernetes.version}-do.0`
    public static region: string = Project.region
    public static readToken: string = process.env.CLUSTER_TOKEN || ''
    public static nodePool = {
      title: 'worker',
      size: 's-1vcpu-2gb',
      count: 1,
      tag: 'vfm-worker'
    }
}
