import { InlineProgramArgs, LocalWorkspace, Stack } from '@pulumi/pulumi/automation'

const installedDependencies = require('../../package-lock.json').dependencies
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

export default async function (stackName: string, program: () => Promise<any>) {
  const stackArguments: InlineProgramArgs = {
    projectName: 'vfm',
    stackName: stackName,
    program
  }

  const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments)

  await stack.workspace.installPlugin('digitalocean', findDependencyVersion('@pulumi/digitalocean'))
  await stack.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
  await stack.refresh({ onOutput: console.info })
  await stack.up({ onOutput: console.info })
}
