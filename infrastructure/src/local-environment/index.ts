import { COLORS, Stdout, UNICODE } from '../utilities/terminal'
import { K3D, LocalClusterManager } from './cluster'
import { createKubernetesManifests } from '../pulumi/create-kubernetes-manifests'
import { LocalProgram } from '../pulumi/Program'
import { Stack } from '../pulumi/Stack'
import { promises as fs } from 'fs'
import { pushLocalImage } from './frontend'

async function writeKubeconfigToFile (path: string, kubeconfig: string) {
  await fs.writeFile(path, kubeconfig)
}

const cluster = new LocalClusterManager(new K3D())
const local = new Stack('local', async () => createKubernetesManifests(await cluster.kubeconfig()))

export async function start (): Promise<void> {
  try {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting cluster...')
    await cluster.launch()
    await writeKubeconfigToFile(process.env.KUBECONFIG ?? '', await cluster.kubeconfig())
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster running')
  } catch (e: unknown) {
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to start cluster')
    throw e
  }

  try {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Pushing images to container registry...')
    pushLocalImage()
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Images pushed to container registry')
  } catch (e: unknown) {
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to push images to container registry')
    throw e
  }

  try {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Deploying apps...')
    await LocalProgram.forStack(local).execute()
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Apps deployed')
  } catch (e: unknown) {
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to deploy apps')
    throw e
  }
}

export async function stop (): Promise<void> {
  try {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Stopping cluster')
    await cluster.stop()
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster stopped')
  } catch (e: unknown) {
    Stdout.clearLastLine()
    Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to stop cluster')
    throw e
  }
}
