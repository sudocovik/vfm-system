import { LocalClusterManager } from './local-cluster-manager'
import { k3dCluster } from './k3d-cluster'

const clusterManager = new LocalClusterManager(new k3dCluster())

process.stdout.write('\x1b[33m' + 'Starting cluster...' + '\x1b[0m')
clusterManager.launch().then(() => {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearScreenDown()
    process.stdout.write('\n' + '\x1b[32m' + 'Cluster running' + '\x1b[0m')
})

process.on('SIGINT', () => {
    console.log("\nstopping cluster...")
    clusterManager.stop().then(() => {
        console.log('cluster stopped!')
        process.exit(0)
    })
})

setInterval(() => {}, 30000)