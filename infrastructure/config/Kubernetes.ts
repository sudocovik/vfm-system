import { Project } from './Project'

export class Kubernetes {
    public static version = '1.21.5'
    public static namespace: string = Project.nameLowercase
    public static traefikVersion = '10.6.2'
    public static containerRegistryCredentials: string = process.env.CLUSTER_CONTAINER_REGISTRY_TOKEN || ''
}
