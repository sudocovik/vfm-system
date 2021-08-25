import provisionResources from './pulumi/provision'

provisionResources().then(() => console.log('Provisio1ned all resources')).catch(error => console.log(error))