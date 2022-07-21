import { createCommand, program as cli } from 'commander'
import { FrontendCommands } from './FrontendCommands'

const build = createCommand()
  .name('build')
  .description('Build frontend image locally')
  .action(FrontendCommands.build)

cli.addCommand(build)
cli.parse()
