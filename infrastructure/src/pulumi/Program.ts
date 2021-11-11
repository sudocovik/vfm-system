import { Stack } from './Stack'
import { StackExecutor } from './StackExecutor'

const installedDependencies = require('../../package-lock.json').dependencies
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

export class Program {
    constructor(
        public readonly stack: Stack,
        private readonly stackExecutor: StackExecutor,
    ) {
        if (stack instanceof Stack === false)
            throw new TypeError()
    }

    public async execute(): Promise<void> {
        await this.stackExecutor.select(this.stack)
        await this.stackExecutor.installPlugins()
        await this.stackExecutor.refreshState()
        await this.stackExecutor.deployResources()
        /*const vendorStack = await LocalWorkspace.createOrSelectStack({
            stackName: this.stack.name(),
            projectName: 'vfm',
            program: this.stack.resources()
        })

        await Promise.all([
            vendorStack.workspace.installPlugin('digitalocean', findDependencyVersion('@pulumi/digitalocean')),
            vendorStack.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
        ])
        await vendorStack.up()*/
    }
}