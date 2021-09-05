import { BackboneProvisioner } from '../types/BackboneProvisioner'
import { Cluster } from '../types/Cluster'
import { exec } from 'child_process'
import { K3DCluster } from '../resources/local/K3DCluster'

export class LocalProvisioner implements BackboneProvisioner {
    private clusterName: string = 'vfm'
    private clusterVersion: string = '1.21.2'

    provision(): Cluster {
        this.create()
        return new K3DCluster()
    }

    create (): void {
        const command = `k3d cluster create ${this.clusterName} \
                            --agents=1 \
                            --servers=1 \
                            --api-port=127.0.0.1:6443 \
                            --image=rancher/k3s:v${this.clusterVersion}-k3s1 \
                            --k3s-server-arg=--no-deploy=traefik \
                            --kubeconfig-update-default=false \
                            --no-hostip \
                            --no-image-volume \
                            --wait`

        exec(command, (err, stdout, stderr) => {
            if (err) throw err
            if (stderr.length > 0) console.error(stderr)
        })
    }
}