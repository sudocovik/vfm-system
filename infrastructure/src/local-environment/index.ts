import { COLORS, Stdout, UNICODE } from '../utilities/terminal'
import { LocalClusterManager } from './LocalClusterManager'
import { k3dCluster } from './cluster'
import { localProgram as pulumiProgram } from '../pulumi/provision'
import { createKubernetesManifests } from '../pulumi/create-kubernetes-manifests'

const clusterManager = new LocalClusterManager(new k3dCluster())

export async function start(): Promise<void> {
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting cluster...')
    await clusterManager.launch().then(() => {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster running')
    })

    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Deploying apps...')
    await pulumiProgram(async () => {
        createKubernetesManifests(await clusterManager.kubeconfig())
    }).then(() => {
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
