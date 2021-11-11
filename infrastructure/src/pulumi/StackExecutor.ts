import { Stack } from './Stack'
import { LocalWorkspace, Stack as PulumiStack } from '@pulumi/pulumi/automation'

export interface StackExecutor {
    select(stack: Stack): Promise<void>

    installPlugins(): Promise<void>

    refreshState(): Promise<void>

    deployResources(): Promise<void>
}


const installedDependencies = require('../../package-lock.json').dependencies
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

export class PulumiStackExecutor implements StackExecutor {
    private pulumiStack?: PulumiStack

    public async select(stack: Stack): Promise<void> {
        this.pulumiStack = await LocalWorkspace.createOrSelectStack({
            stackName: stack.name(),
            projectName: 'vfm',
            program: stack.resources()
        })
    }

    public async installPlugins(): Promise<void> {
        await Promise.all([
            this.pulumiStack?.workspace.installPlugin('digitalocean', findDependencyVersion('@pulumi/digitalocean')),
            this.pulumiStack?.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
        ])
    }

    public async refreshState(): Promise<void> {
        await this.pulumiStack?.refresh()
    }

    public async deployResources(): Promise<void> {
        await this.pulumiStack?.up()
    }
}