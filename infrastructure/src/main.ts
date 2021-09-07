import provisionResources from './pulumi/provision'
import { createCloudResources } from './pulumi/create-resources'
import { LocalClusterProvisioner } from './provisioners/LocalClusterProvisioner'
import { createKubernetesManifests } from './pulumi/create-kubernetes-manifests'

if (process.env.NODE_ENV === 'production') {
    provisionResources(async () => createCloudResources().then(createKubernetesManifests))
        .then(() => console.log('Provisioned all resources'))
        .catch(error => console.log(error))
}
else if (process.env.NODE_ENV === 'local') {
    console.log('Running in local mode...')
    new LocalClusterProvisioner().provision()
}