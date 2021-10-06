import { promisify } from 'util'
const exec = promisify(require('child_process').exec)

export class k3dCluster {
    public async create() {
        if (await k3dCluster.exists()) {
            return
        }

        await exec('k3d cluster create vfm')
    }

    private static async exists(): Promise<boolean> {
        const { stdout: result } = await exec('k3d cluster list')
        return result.indexOf('vfm') !== -1
    }
}