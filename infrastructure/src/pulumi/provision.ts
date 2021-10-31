import { InlineProgramArgs, LocalWorkspace, Stack } from '@pulumi/pulumi/automation'

const installedDependencies = require('../../package-lock.json').dependencies
const findDependencyVersion = (wantedDependency: string) => installedDependencies[wantedDependency].version

const projectName: string = 'vfm'

export default async function (stackName: string, program: () => Promise<any>) {
  const stackArguments: InlineProgramArgs = {
    projectName: projectName,
    stackName: stackName,
    program
  }

  const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments)

  await stack.workspace.installPlugin('digitalocean', findDependencyVersion('@pulumi/digitalocean'))
  await stack.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
  await stack.refresh({ onOutput: console.info })
  await stack.up({ onOutput: console.info })
}

export async function localProgram (program: () => Promise<any>) {
  const stackArguments: InlineProgramArgs = {
    projectName: projectName,
    stackName: 'local',
    program
  }

  const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments, {
    projectSettings: {
      name: projectName,
      backend: {
        url: `file://${process.env.PROJECT_ROOT}/.cache/`,
      },
      runtime: 'nodejs'
    }
  })

  await stack.workspace.installPlugin('kubernetes', findDependencyVersion('@pulumi/kubernetes'))
  await stack.workspace.installPlugin('docker', findDependencyVersion('@pulumi/docker'))
  await stack.up()
}
