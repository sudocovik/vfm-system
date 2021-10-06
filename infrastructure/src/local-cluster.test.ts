import { k3dCluster } from './local-cluster'

describe('#local cluster', () => {
    test('creating existing cluster should be idempotent', async () => {
        const cluster: k3dCluster = new k3dCluster()
        await cluster.create()
        expect(() => cluster.create()).not.toThrow()
    }, 1000 * 60 * 2)
})