import { COLORS, Stdout, UNICODE } from '../utilities/terminal'
import { InfiniteProcess } from '../utilities/process/process'
import { LocalClusterManager } from './local-cluster-manager'
import { k3dCluster } from './k3d-cluster'
import pulumiProgram from './pulumi-program'
import { createKubernetesManifests } from '../pulumi/create-kubernetes-manifests'

const script = new InfiniteProcess()
const clusterManager = new LocalClusterManager(new k3dCluster())

script.onGracefulShutdownRequest(async () => {
    Stdout.clearLastLine() // hide ^C produced by hitting Control+C
    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Stopping cluster')

    clusterManager.stop().then(() => {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster stopped')
        process.exit(0)
    })
})

script.run(async () => {
    Stdout.clearAll()

    Stdout.write(Stdout.colorize(COLORS.YELLOW, UNICODE.FULL_CIRCLE) + ' Starting cluster...')
    await clusterManager.launch().then(() => {
        Stdout.clearLastLine()
        Stdout.writeLine(Stdout.colorize(COLORS.GREEN, UNICODE.CHECK_MARK) + ' Cluster running')
    })
}).then()
