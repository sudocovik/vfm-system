import pulumiProgram from './pulumi-program'

pulumiProgram(async () => {
    await import('./cloud-resources')
})