import { InlineProgramArgs, LocalWorkspace, Stack } from '@pulumi/pulumi/automation'

export default async function (program: () => Promise<any>) {
  const stackArguments: InlineProgramArgs = {
    projectName: 'vfm',
    stackName: 'production',
    program
  }

  const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments)

  await stack.workspace.installPlugin('digitalocean', '4.6.0')
  await stack.workspace.installPlugin('kubernetes', '3.7.0')
  await stack.refresh({ onOutput: console.info })
  await stack.up({ onOutput: console.info })
}
