import provisionResources from './pulumi/provision'

if (process.env.NODE_ENV === 'production') {
    provisionResources().then(() => console.log('Provisioned all resources')).catch(error => console.log(error))
}
else if (process.env.NODE_ENV === 'local') {
    console.log('Running in local mode...')
}