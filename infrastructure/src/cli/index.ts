import {
    start as startLocalEnvironment,
    stop as stopLocalEnvironment
} from '../local-environment/index'
import { Command } from 'commander'
import { test as runUnitTests } from './unit-tests'
import { deployBackboneResources } from '../production/backbone-deploy'

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

const test = program.command('test')
test.option('-w, --watch', 'Watch filesystem changes and re-run tests', false)
test.action(({ watch }) => {
    runUnitTests(watch)
})

const deploy = program.command('deploy')
deploy.description('Deploy backbone resources to production')
deploy.action(deployBackboneResources)


program.parse()