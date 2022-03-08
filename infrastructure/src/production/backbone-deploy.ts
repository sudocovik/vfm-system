import { describeBackboneResources } from './backbone'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'

export function deployBackboneResources (): void {
  Program.forStack(
    new Stack('backbone-production', describeBackboneResources())
  ).execute()
}
