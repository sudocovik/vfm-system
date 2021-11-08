import { Stack } from './Stack'
import { LocalWorkspace } from '@pulumi/pulumi/automation'

const installedDependencies = require('../../package-lock.json').dependencies
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

export class Program {
    constructor(public readonly stack: Stack) {
        if (stack instanceof Stack === false)
            throw new TypeError()
    }

    public async execute(): Promise<void> {
        const vendorStack = await LocalWorkspace.createOrSelectStack({
            stackName: this.stack.name(),
            projectName: 'vfm',
            program: this.stack.resources()
        })

        await Promise.all([
            vendorStack.workspace.installPlugin('digitalocean', findDependencyVersion('@pulumi/digitalocean')),
            vendorStack.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
        ])
    }
}