import { Project } from './Project'

export class Kubernetes {
    public static version: string = '1.21.5'
    public static namespace: string = Project.nameLowercase
    public static traefikVersion: '10.6.0'
    public static containerRegistryCredentials: string = process.env.CLUSTER_CONTAINER_REGISTRY_TOKEN || ''
}