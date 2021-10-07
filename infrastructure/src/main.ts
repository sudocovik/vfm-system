import provisionResources from './pulumi/provision'
import { createCloudResources } from './pulumi/create-resources'
import { createKubernetesManifests } from './pulumi/create-kubernetes-manifests'

const clusterToken: string = process.env.CLUSTER_TOKEN || ''

provisionResources(async () => createCloudResources(clusterToken).then(createKubernetesManifests))
    .then(() => console.log('Provisioned all resources'))
