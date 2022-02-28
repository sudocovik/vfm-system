import { Program } from '../Program'
import { Stack } from '../Stack'
import { LocalWorkspace } from '@pulumi/pulumi/automation'
import * as kubernetes from '@pulumi/kubernetes'

const stackName = 'integration-testing'
const projectName = 'vfm'
const TWO_MINUTES = 2 * 60 * 1000
const FIVE_MINUTES = 5 * 60 * 1000
const noResources = async () => { /* empty because test's do not need resources */ }

describe('#Program', () => {
  beforeAll(() => {
    process.env.PULUMI_AUTOMATION_API_SKIP_VERSION_CHECK = 'true'
  })

  afterAll(() => {
    process.env.PULUMI_AUTOMATION_API_SKIP_VERSION_CHECK = 'false'
  })

  afterEach(async () => {
    const stack = await LocalWorkspace.selectStack({
      stackName,
      projectName,
      program: noResources
    })

    const installedPlugins = await stack.workspace.listPlugins()
    installedPlugins.forEach(({ name }) => stack.workspace.removePlugin(name))
    await stack.destroy()
  }, FIVE_MINUTES)

  it('should install required plugins', async () => {
    const stack = new Stack(stackName, noResources)
    const program = Program.forStack(stack)

    await program.execute().then(async () => {
      const pulumiStack = await LocalWorkspace.selectStack({
        stackName: stack.name(),
        projectName,
        program: stack.resources()
      })

      const installedPlugins = await pulumiStack.workspace.listPlugins()
      const pluginNames = installedPlugins.map(plugin => plugin.name)

      expect(pluginNames).toContain('digitalocean')
      expect(pluginNames).toContain('kubernetes')
    })
  }, TWO_MINUTES)

  it('should deploy specified resources', async () => {
    const stack = new Stack(stackName, async () => {
      const ONE_MINUTE = '1m'
      new kubernetes.Provider('test', {}, {
        customTimeouts: {
          create: ONE_MINUTE,
          update: ONE_MINUTE,
          delete: ONE_MINUTE
        }
      })
    })
    const program = Program.forStack(stack)

    await program.execute().then(async () => {
      const pulumiStack = await LocalWorkspace.selectStack({
        stackName: stack.name(),
        projectName,
        program: stack.resources()
      })

      const { resources } = (await pulumiStack.exportStack()).deployment
      const resourceTypes = resources.map(({ type }: { type: string }) => type)
      expect(resourceTypes).toContain('pulumi:providers:kubernetes')
    })
  }, FIVE_MINUTES)
})
