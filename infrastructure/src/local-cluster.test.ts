import { k3dCluster } from './local-cluster'

describe('#local cluster', () => {
    let cluster: k3dCluster

    beforeAll(() => {
        cluster = new k3dCluster()
    })

    test('creating existing cluster should be idempotent', async () => {
        await cluster.create()
        expect(() => cluster.create()).not.toThrow()
    }, 1000 * 60 * 2)
})