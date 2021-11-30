import { Stack } from './Stack'
import { LocalWorkspace, Stack as PulumiStack } from '@pulumi/pulumi/automation'
import { Directory } from '../../config'
import * as lockfile from '@yarnpkg/lockfile'
import * as fs from 'fs'

export interface StackExecutor {
    select(stack: Stack): Promise<void>

    installPlugins(): Promise<void>

    refreshState(): Promise<void>

    deployResources(): Promise<void>
}


const yarnLockFile = fs.readFileSync(`${Directory.projectRoot}/yarn.lock`, 'utf8')
const rawInstalledDependencies = lockfile.parse(yarnLockFile).object
const installedDependencies = Object.keys(rawInstalledDependencies)
    .reduce((dependencies: any, dependencyName: string) => {
        const dependencyNameWithoutVersion: string = dependencyName.substring(0, dependencyName.lastIndexOf('@'))
        dependencies[dependencyNameWithoutVersion] = rawInstalledDependencies[dependencyName]
        return dependencies
    }, {})
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

const projectName = 'vfm'

export class PulumiStackExecutor implements StackExecutor {
    protected pulumiStack?: PulumiStack

    public async select(stack: Stack): Promise<void> {
        this.pulumiStack = await LocalWorkspace.createOrSelectStack({
            stackName: stack.name(),
            projectName: projectName,
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

export class LocalStackExecutor extends PulumiStackExecutor implements StackExecutor {
    public override async select(stack: Stack): Promise<void> {
        this.pulumiStack = await LocalWorkspace.createOrSelectStack({
            stackName: stack.name(),
            projectName: projectName,
            program: stack.resources()
        }, {
            projectSettings: {
                name: projectName,
                backend: {
                    url: `file://${Directory.cacheRoot}`,
                },
                runtime: 'nodejs'
            }
        })
    }

    public override async installPlugins(): Promise<void> {
        await Promise.all([
            this.pulumiStack?.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes')),
            this.pulumiStack?.workspace.installPlugin('docker', findDependencyVersion('@pulumi/docker'))
        ])
    }
}