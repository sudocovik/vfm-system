import * as k8s from '@pulumi/kubernetes'

export function createKubernetesManifests(kubeconfig: string): void {
    const provider: k8s.Provider = new k8s.Provider('main-kubernetes-provider', {
        kubeconfig
    })

    const labels = { app: 'nginx' }

    const deployment = new k8s.apps.v1.Deployment('nginx-test', {
        spec: {
            selector: { matchLabels: labels },
            replicas: 1,
            template: {
                metadata: { labels: labels },
                spec: {
                    containers: [{
                        name: 'nginx',
                        image: 'nginx:1.21-alpine',
                        ports: [{
                            containerPort: 80,
                            protocol: 'TCP'
                        }]
                    }]
                }
            }
        }
    }, { provider })

    new k8s.core.v1.Service('nginx-test', {
        metadata: { labels: deployment.spec.template.metadata.labels },
        spec: {
            type: 'ClusterIP',
            ports: [{
                port: 8080,
                targetPort: 80,
                protocol: 'TCP'
            }],
            selector: deployment.spec.template.metadata.labels,
        },
    }, { provider })
}
