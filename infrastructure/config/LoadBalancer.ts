import { Project } from './Project'

export class LoadBalancer {
    public static title: string = Project.nameLowercase
    public static region: string = Project.region
    public static size: string = 'lb-small'
}