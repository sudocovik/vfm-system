import { COLORS, Stdout, UNICODE } from '../utilities/terminal'
import { LocalClusterManager } from './LocalClusterManager'
import { k3dCluster } from './cluster'
import { createKubernetesManifests } from '../pulumi/create-kubernetes-manifests'
import { LocalProgram } from '../pulumi/Program'
import { Stack } from '../pulumi/Stack'

const clusterManager = new LocalClusterManager(new k3dCluster())
const local = new Stack('local', async () => {
    createKubernetesManifests(await clusterManager.kubeconfig())
})

export async function start(): Promise<void> {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting cluster...')
    await clusterManager.launch().then(() => {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster running')
    })

    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Deploying apps...')
    await LocalProgram.forStack(local)
        .execute()
        .then(() => {
            Stdout.clearLastLine()
            Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Apps deployed')
        })
}

export async function stop(): Promise<void> {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Stopping cluster')

    clusterManager.stop().then(() => {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster stopped')
    })
}
