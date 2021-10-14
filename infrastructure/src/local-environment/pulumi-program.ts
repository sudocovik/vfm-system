import { InlineProgramArgs, LocalWorkspace, Stack } from '@pulumi/pulumi/automation'

export default async function (program: () => Promise<any>) {
    const stackArguments: InlineProgramArgs = {
        projectName: 'vfm',
        stackName: 'local',
        program
    }

    const stack: Stack = await LocalWorkspace.createOrSelectStack(stackArguments, {
        projectSettings: {
            name: 'vfm',
            backend: {
                url: `file://${process.env.PROJECT_ROOT}/.cache/`,
            },
            runtime: 'nodejs'
        }
    })

    await stack.workspace.installPlugin('digitalocean', '4.6.0')
    await stack.workspace.installPlugin('kubernetes', '3.7.0')
    await stack.workspace.installPlugin('docker', '3.1.0')
    await stack.up()
}