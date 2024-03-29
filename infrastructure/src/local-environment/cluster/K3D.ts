import { promisify } from 'util'
import { LocalCluster } from './LocalCluster'
import { exec as callbackBasedExec } from 'child_process'
import { Directory, Frontend, Kubernetes } from '../../../config'

const exec = promisify(callbackBasedExec)

export class K3D implements LocalCluster {
  public async create (): Promise<void> {
    const options = [
      '--wait',
      '--timeout=120s',
      '--k3s-arg=\'--no-deploy=traefik\'@server:*',
      '--port 80:32080@loadbalancer',
      '--api-port 6445',
      '--registry-create=vfm-registry:5000',
      `--image=rancher/k3s:v${Kubernetes.version}-k3s2`,
      `--volume=${Frontend.rootFromHost}:/${Frontend.mountRoot}@server:*`,
      `--registry-config="${Directory.configRoot}/registry.yaml"`
    ]

    await exec('k3d cluster create vfm ' + options.join(' '))
  }

  public async destroy (): Promise<void> {
    await exec('k3d cluster delete vfm')
  }

  public async exists (): Promise<boolean> {
    const { stdout: result } = await exec('k3d cluster list')
    return result.indexOf('vfm') !== -1
  }

  public async start (): Promise<void> {
    await exec('k3d cluster start vfm')
  }

  public async stop (): Promise<void> {
    await exec('k3d cluster stop vfm')
  }

  public async kubeconfig (): Promise<string> {
    const { stdout } = await exec('k3d kubeconfig get vfm')
    return stdout
  }
}
