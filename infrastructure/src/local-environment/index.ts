import { COLORS, Stdout, UNICODE } from '../utilities/terminal'
import { LocalClusterManager } from './LocalClusterManager'
import { k3dCluster } from './cluster'
import { createKubernetesManifests } from '../pulumi/create-kubernetes-manifests'
import { LocalProgram } from '../pulumi/Program'
import { Stack } from '../pulumi/Stack'
import { promises as fs } from 'fs'
import { spawnSync } from 'child_process'

async function writeKubeconfigToFile(path: string, kubeconfig: string) {
    await fs.writeFile(path, kubeconfig)
}

function startHotReload() {
    spawnSync('devspace', [
        'sync',
        '--local-path=/frontend',
        '--container-path=/app',
        '--namespace=vfm',
        '--exclude=.idea',
        '--initial-sync=preferNewest',
        '-l app=frontend',
    ], {
        stdio: 'inherit',
    })
}

const cluster = new LocalClusterManager(new k3dCluster())
const local = new Stack('local', async () => {
    createKubernetesManifests(await cluster.kubeconfig())
})

export async function start(): Promise<void> {
    try {
        Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting cluster...')
        await cluster.launch()
        await writeKubeconfigToFile(process.env.KUBECONFIG ?? '', await cluster.kubeconfig())
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster running')
    } catch (e: any) {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to start cluster')
        throw e
    }

    try {
        Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Deploying apps...')
        await LocalProgram.forStack(local).execute()
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Apps deployed')
    } catch (e: any) {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to deploy apps')
        throw e
    }

    Stdout.writeLine(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting hot reload...')
    await startHotReload()
}

export async function stop(): Promise<void> {
    try {
        Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Stopping cluster')
        await cluster.stop()
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster stopped')
    } catch (e: any) {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.RED, UNICODE.CROSS_MARK) + ' Failed to stop cluster')
        throw e
    }
}
