import provisionResources from './pulumi/provision'
import { createCloudResources } from './pulumi/create-resources'
import { LocalClusterProvisioner } from './provisioners/LocalClusterProvisioner'
import { createKubernetesManifests } from './pulumi/create-kubernetes-manifests'

const clusterToken: string = process.env.CLUSTER_TOKEN || ''

if (process.env.NODE_ENV === 'production') {
    provisionResources(async () => createCloudResources(clusterToken).then(createKubernetesManifests))
        .then(() => console.log('Provisioned all resources'))
}
else if (process.env.NODE_ENV === 'local') {
    console.log('Running in local mode...')
    new LocalClusterProvisioner().provision()
}