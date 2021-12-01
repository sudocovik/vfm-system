import { Project } from './Project'

export class Kubernetes {
    public static version: string = '1.21.5'
    public static namespace: string = Project.nameLowercase
    public static traefikVersion: string = '10.6.2'
    public static containerRegistryCredentials: string = process.env.CLUSTER_CONTAINER_REGISTRY_TOKEN || ''
    public static metricsServerVersion: string = '3.7.0'
}