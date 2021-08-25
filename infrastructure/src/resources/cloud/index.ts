import { Domain, Project } from '@pulumi/digitalocean'

export default class {
    public provisionAll(): void {
        const domain: Domain = this.provisionDomain()
        this.provisionProject(domain)
    }

    private provisionDomain(): Domain {
        return new Domain('main-domain', {
            name: 'zarafleet.com'
        })
    }

    private provisionProject(domain: Domain): Project {
        return new Project('main-project', {
            name: 'VFM',
            environment: 'Production',
            description: 'Vehicle Fleet Management infrastructure',
            purpose: 'Web Application',
            resources: [
                domain.domainUrn
            ]
        })
    }
}