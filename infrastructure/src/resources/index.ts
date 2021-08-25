import CloudResources from '../resources/cloud/index'

export default async function () {
    const resources: CloudResources = new CloudResources()
    resources.provisionAll()
}