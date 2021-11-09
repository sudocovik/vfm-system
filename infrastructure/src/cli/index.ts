import {
    start as startLocalEnvironment,
    stop as stopLocalEnvironment
} from '../local-environment/index'
import { Command } from 'commander'
import {
    unitTest as runUnitTests,
    integrationTest as runIntegrationTests
} from './unit-tests'
import { deployBackboneResources } from '../production/backbone-deploy'
import { deployFrontendResources } from '../production/frontend'
import { deployBackendResources } from '../production/backend'

const program = new Command()

const local = new Command('local')
local.description('Manage local environment')
local.command('start', { isDefault: true })
     .description('Start local environment')
     .action(startLocalEnvironment)
local.command('stop')
     .description('Stop local environment')
     .action(stopLocalEnvironment)

program.addCommand(local, { isDefault: true })

const unitTest = program.command('test:unit')
unitTest.option('-w, --watch', 'Watch filesystem changes and re-run tests', false)
unitTest.action(({ watch }) => {
    const exitCode = runUnitTests(watch)
    process.exit(exitCode ?? -1)
})

const integrationTest = program.command('test:integration')
integrationTest.action(() => {
    const exitCode = runIntegrationTests()
    process.exit(exitCode ?? -1)
})

const deploy = new Command('deploy')
deploy.command('infrastructure')
      .description('Deploy backbone resources to production')
      .action(deployBackboneResources)
deploy.command('frontend')
      .description('Deploy frontend to production')
      .action(deployFrontendResources)
deploy.command('backend')
      .description('Deploy backend to production')
      .action(deployBackendResources)

program.addCommand(deploy)


program.parse()