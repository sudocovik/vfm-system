import { InlineProgramArgs, LocalWorkspace, Stack } from '@pulumi/pulumi/automation'
import provisionResources from '../resources/index'

export default async function () {
  const stackArguments: InlineProgramArgs = {
    projectName: 'vfm',
    stackName: 'production',
    program: provisionResources
  }

  const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments)

  await stack.workspace.installPlugin('digitalocean', '4.6.0')
  await stack.refresh({ onOutput: console.info })
  await stack.up({ onOutput: console.info })
}
