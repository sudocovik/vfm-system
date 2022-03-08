import { describeBackboneResources } from './backbone'
import {
  ProjectConfiguration
} from './backbone-types'
import { Stack } from '../pulumi/Stack'
import { Program } from '../pulumi/Program'
import { Project } from '../../config'

export function deployBackboneResources (): void {
  const projectConfiguration: ProjectConfiguration = {
    name: Project.nameUppercase,
    description: Project.description,
    environment: Project.environment,
    purpose: Project.purpose
  }

  Program.forStack(
    new Stack('backbone-production', describeBackboneResources(
      projectConfiguration
    ))
  ).execute()
}
