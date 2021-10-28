// import '../local-environment/index'
import { Command } from 'commander'
import { test as runUnitTests } from './unit-tests'

const program = new Command()

const test = program.command('test')
test.option('-w, --watch', 'Watch filesystem changes and re-run tests', false)
test.action(({ watch }) => {
    runUnitTests(watch)
})


program.parse()