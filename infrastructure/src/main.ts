import provisionResources from './pulumi/provision'

provisionResources().then(() => console.log('Provisioned all resources')).catch(error => console.log(error))