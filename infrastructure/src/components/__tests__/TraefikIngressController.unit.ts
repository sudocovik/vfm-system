/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "chartResourceIdShouldBe", "chartOptionsShouldInclude", "chartValuesShouldInclude"] }] */
/* eslint-disable import/first */
/* Disabled because order matters when mocking module */
import { outputOf } from '../../utilities/testing/pulumi'

const mockHelmChart = jest.fn()
jest.mock('@pulumi/kubernetes', () => ({
  helm: { v3: { Chart: mockHelmChart } }
}))

import * as k8s from '@pulumi/kubernetes'
import { createTraefikIngressController } from '../TraefikIngressController'
import { Kubernetes, LoadBalancer } from '../../../config'
import * as pulumi from '@pulumi/pulumi'

beforeEach(jest.clearAllMocks)

function traefikIngressControllerFactory (resourceOptions?: pulumi.ResourceOptions) {
  const namespace = pulumi.Output.create('unit-test-namespace')
  const traefik = createTraefikIngressController(namespace, resourceOptions)

  return {
    namespace,
    traefik
  }
}

describe('Traefik', () => {
  it('should have a unique resource ID', () => {
    traefikIngressControllerFactory()

    const id = getChartUniqueResourceId()
    expect(id).toEqual('ingress-controller')
  })

  it('should return Helm v3 Chart', () => {
    const { traefik } = traefikIngressControllerFactory()
    expect(traefik).toBeInstanceOf(k8s.helm.v3.Chart)
  })

  it('should have a chart name', () => {
    traefikIngressControllerFactory()
    const name = getChartOptions().chart
    expect(name).toEqual('traefik')
  })

  it('should have a version', () => {
    traefikIngressControllerFactory()
    const version = getChartOptions().version
    expect(version).toEqual(Kubernetes.traefikVersion)
  })

  it('should have a repository URL', () => {
    traefikIngressControllerFactory()
    const repository = getChartOptions().fetchOpts.repo
    expect(repository).toEqual('https://helm.traefik.io/traefik')
  })

  it('should deploy resources to a specified namespace', async () => {
    const { namespace } = traefikIngressControllerFactory()

    const expectedNamespace = await outputOf(namespace)
    const actualNamespace = await outputOf(getChartOptions().namespace)
    expect(actualNamespace).toEqual(expectedNamespace)
  })

  it('should be deployed as NodePort service', () => {
    traefikIngressControllerFactory()
    const serviceType = getChartValues().service.type
    expect(serviceType).toEqual('NodePort')
  })

  it('should run on the same port as Load Balancer internal HTTP port', () => {
    traefikIngressControllerFactory()
    const nodePort = getChartValues().ports.web.nodePort
    expect(nodePort).toEqual(LoadBalancer.ports.http.internal)
  })

  it('should not expose HTTPS port', () => {
    traefikIngressControllerFactory()
    const httpsExposed = getChartValues().ports.websecure.expose
    expect(httpsExposed).toEqual(false)
  })

  it('should not expose dashboard', () => {
    traefikIngressControllerFactory()
    const dashboardExposed = getChartValues().ingressRoute.dashboard.enabled
    expect(dashboardExposed).toEqual(false)
  })

  it('should workaround wrong namespace on Kubernetes Service object', async () => {
    const { namespace } = traefikIngressControllerFactory()
    const { workaroundServiceNamespaceProblems } = getChartTransformations()

    const fakeServiceObject = {
      kind: 'Service',
      metadata: {
        namespace: pulumi.output('wrong-namespace')
      }
    }

    workaroundServiceNamespaceProblems(fakeServiceObject)

    const expectedNamespace = await outputOf(namespace)
    const actualNamespace = await outputOf(fakeServiceObject.metadata.namespace)
    expect(actualNamespace).toEqual(expectedNamespace)
  })

  it('should not workaround wrong namespace on non-Service objects', async () => {
    traefikIngressControllerFactory()
    const { workaroundServiceNamespaceProblems } = getChartTransformations()

    const fakeDeploymentObject = {
      kind: 'Deployment',
      metadata: {
        namespace: pulumi.output('random-namespace')
      }
    }

    workaroundServiceNamespaceProblems(fakeDeploymentObject)

    const expectedNamespace = 'random-namespace'
    const actualNamespace = await outputOf(fakeDeploymentObject.metadata.namespace)
    expect(actualNamespace).toEqual(expectedNamespace)
  })

  it('should not open Service ports to a public network', () => {
    traefikIngressControllerFactory()
    const { doNotExposeServicePortsPublicly } = getChartTransformations()

    const fakeServiceObject = {
      kind: 'Service',
      metadata: {
        annotations: {}
      }
    }

    doNotExposeServicePortsPublicly(fakeServiceObject)

    expect(fakeServiceObject.metadata.annotations).toEqual({ 'kubernetes.digitalocean.com/firewall-managed': 'false' })
  })

  it('should not try to close Service ports on non-Service objects', () => {
    traefikIngressControllerFactory()
    const { doNotExposeServicePortsPublicly } = getChartTransformations()

    const expectedAnnotations = {}
    const fakeDeploymentObject = {
      kind: 'Deployment',
      metadata: {
        annotations: expectedAnnotations
      }
    }

    doNotExposeServicePortsPublicly(fakeDeploymentObject)

    expect(fakeDeploymentObject.metadata.annotations).toEqual(expectedAnnotations)
  })

  it('should pass custom resource options', () => {
    const expectedResourceOptions = { id: 'irrelevant-id' }

    traefikIngressControllerFactory(expectedResourceOptions)

    const actualResourceOptions = getChartResourceOptions()
    expect(actualResourceOptions).toEqual(expectedResourceOptions)
  })
})

function getChartUniqueResourceId () {
  return mockHelmChart.mock.calls[0][0]
}

function getChartOptions () {
  return mockHelmChart.mock.calls[0][1]
}

function getChartValues () {
  return getChartOptions().values
}

function getChartTransformations () {
  const transformations = getChartOptions().transformations

  return {
    workaroundServiceNamespaceProblems: transformations[0],
    doNotExposeServicePortsPublicly: transformations[1]
  }
}

function getChartResourceOptions () {
  return mockHelmChart.mock.calls[0][2]
}
