import { mount } from '@cypress/vue'
import ListOfVehicles from '../ListOfVehicles.vue'
import GeoLocatedVehicle from '../GeoLocatedVehicle.vue'
import {
  firstGeoLocatedVehicle,
  secondGeoLocatedVehicle,
  updatedFirstGeoLocatedVehicle,
  updatedSecondGeoLocatedVehicle
} from '../__fixtures__/geo-located-vehicles'
import { VueWrapper } from '@vue/test-utils'
import { GeoLocatedVehicle as Vehicle, VehicleList } from 'src/backend/VehicleService'
import { shortPoll } from 'src/support/short-poll'
import { sleep } from 'src/support/sleep'
import type { SinonStub } from 'cypress/types/sinon'

function assertGeoLocatedVehicleProps (vehicleComponent: VueWrapper<InstanceType<typeof GeoLocatedVehicle>>, expectedVehicle: Vehicle) {
  expect((vehicleComponent.vm as unknown as { $: { vnode: { key: number }}}).$.vnode.key).to.equal(expectedVehicle.id())
  expect(vehicleComponent.props('licensePlate')).to.equal(expectedVehicle.licensePlate())
  expect(vehicleComponent.props('latitude')).to.equal(expectedVehicle.latitude())
  expect(vehicleComponent.props('longitude')).to.equal(expectedVehicle.longitude())
  expect(vehicleComponent.props('address')).to.equal(expectedVehicle.address())
  expect(vehicleComponent.props('speed')).to.deep.equal(expectedVehicle.speed())
  expect(vehicleComponent.props('ignition')).to.equal(expectedVehicle.ignition())
  expect(vehicleComponent.props('moving')).to.equal(expectedVehicle.moving())
  expect(vehicleComponent.props('course')).to.equal(expectedVehicle.course())
}

let shortPollStub: SinonStub

describe('ListOfVehicles', () => {
  beforeEach(stubShortPoll)

  specify('given list of non-vehicles it should render nothing', () => {
    const gibberish = [false, null, undefined, 'lol', -1]

    mountListOfVehicles({ vehicles: gibberish })

    cy.dataCy('root-node').should('not.have.html')
  })

  specify('given list of single vehicle it should render it', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(() => Cypress.vueWrapper.findComponent(GeoLocatedVehicle))
      .then(component => assertGeoLocatedVehicleProps(component, firstGeoLocatedVehicle))
  })

  specify('given list of two vehicles it should render both of them', () => {
    const vehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    assertRenderedVehiclesAre(vehicles)
  })

  it('should render vehicles under root node', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(() => Cypress.vueWrapper.findComponent(GeoLocatedVehicle))
      .then(component => component.element as unknown as JQuery)
      .then(element => element[0].outerHTML)
      .then(html => cy.dataCy('root-node').should('have.html', html))
  })

  describe('Background refresh', () => {
    it('should utilize short poll for fetching new data with 2 seconds delay between fetches', () => {
      mountListOfVehicles()

      cy.then(() => {
        expect(shortPollStub.args[0][0]).to.equal(VehicleList.fetchAll)
        expect(shortPollStub.args[0][2]).to.equal(2000)
      })
    })

    specify('given two vehicles when first one updates it should re-render it', () => {
      const initialVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      const updatedVehicles = [updatedFirstGeoLocatedVehicle, secondGeoLocatedVehicle]

      const { fetchVehiclesStub, waitForComponentsRerender } = simulateFetchedVehicles(updatedVehicles)
      restoreShortPoll()

      mountListOfVehicles({ vehicles: initialVehicles })
      assertRenderedVehiclesAre(initialVehicles)

      cy.wrap(fetchVehiclesStub).should('have.been.calledOnce')
      waitForComponentsRerender()
      assertRenderedVehiclesAre(updatedVehicles)

      stopShortPoll()
    })

    specify('given two vehicles when second one updates it should re-render it', () => {
      const initialVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      const updatedVehicles = [firstGeoLocatedVehicle, updatedSecondGeoLocatedVehicle]

      const { fetchVehiclesStub, waitForComponentsRerender } = simulateFetchedVehicles(updatedVehicles)
      restoreShortPoll()

      mountListOfVehicles({ vehicles: initialVehicles })
      assertRenderedVehiclesAre(initialVehicles)

      cy.wrap(fetchVehiclesStub).should('have.been.calledOnce')
      waitForComponentsRerender()
      assertRenderedVehiclesAre(updatedVehicles)

      stopShortPoll()
    })
  })
})

function mountListOfVehicles (props?: Record<string, unknown>) {
  const defaultProps = { vehicles: [] }
  const allProps = { ...defaultProps, ...props }

  mount(ListOfVehicles, {
    props: allProps,
    global: {
      stubs: {
        BaseMap: true
      }
    }
  })
}

function assertRenderedVehiclesAre (vehicles: Vehicle[]) {
  return cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle))
    .then(allGeoLocatedVehicleComponents => {
      expect(allGeoLocatedVehicleComponents.length).to.equal(2)
      return allGeoLocatedVehicleComponents
    })
    .then(allGeoLocatedVehicleComponents => {
      allGeoLocatedVehicleComponents.forEach((component, i) => assertGeoLocatedVehicleProps(component, vehicles[i]))
    })
}

function stubShortPoll () {
  shortPollStub = cy.stub(shortPoll, 'do').callsFake(() => { /* prevent recursion */ })
}

function restoreShortPoll () {
  shortPollStub.restore()
}

function stopShortPoll () {
  cy.then(stubShortPoll)
}

function simulateFetchedVehicles (vehicles: Vehicle[]) {
  const delayNeededForComponentsRerender = 50

  const fetchVehiclesStub = cy.stub(VehicleList, 'fetchAll').callsFake(async () => {
    await sleep.now(delayNeededForComponentsRerender)
    return vehicles
  })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  const waitForComponentsRerender = () => cy.wait(delayNeededForComponentsRerender)

  return { fetchVehiclesStub, waitForComponentsRerender }
}
