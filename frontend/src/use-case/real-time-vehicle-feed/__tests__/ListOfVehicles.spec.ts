import { mount } from '@cypress/vue'
import { inAllLanguages } from 'test/support/api'
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

type GeoLocatedVehicleWrapper = VueWrapper<InstanceType<typeof GeoLocatedVehicle>>
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
      .then(html => cy.dataCy('root-node').should('contain.html', html))
  })

  specify('map interactivity should be false on all vehicles', () => {
    mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

    cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle))
      .each((vehicleComponent: GeoLocatedVehicleWrapper) => mapInteractivityShouldBe(vehicleComponent, false))
  })

  inAllLanguages.it('should have a heading', (t) => {
    mountListOfVehicles()

    cy.dataCy('root-node')
      .dataCy('heading')
      .then($el => $el.text().trim())
      .then(text => cy.wrap(text))
      .should('equal', t('vehicles'))
  })

  describe('when user clicks on vehicle', () => {
    it('should maximize vehicle card and hide every other card', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      getVehicleCardByIndex(0).as('first-vehicle')

      getVehicleContainerHeight()
        .then(containerHeight => getVehicleHeight('first-vehicle').should('be.lessThan', containerHeight / 2))

      cy.get('@first-vehicle').click()

      getVehicleContainerHeight()
        .then(containerHeight => getVehicleHeight('first-vehicle').should('equal', containerHeight))
    })

    it('should show back button', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      cy.dataCy('back-button').as('back-button')
      cy.get('@back-button').should('not.be.visible')

      openInSingleVehicleView(firstGeoLocatedVehicle)

      cy.get('@back-button').should('be.visible')
    })

    it('should make the map interactive', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      openInSingleVehicleView(firstGeoLocatedVehicle)

      cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle))
        .then(components => {
          mapInteractivityShouldBe(components[0], true)
          mapInteractivityShouldBe(components[1], false)
        })
    })

    describe('when user clicks on back button', () => {
      beforeEach(() => {
        mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })
        openInSingleVehicleView(firstGeoLocatedVehicle)
        cy.dataCy('back-button').click()
      })

      it('should return to all vehicles view', () => {
        assertNotInSingleVehicleView()
      })

      it('should hide back button', () => {
        cy.dataCy('back-button').should('not.be.visible')
      })

      it('should make map non-interactive for all vehicles', () => {
        cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle))
          .each((vehicleComponent: GeoLocatedVehicleWrapper) => mapInteractivityShouldBe(vehicleComponent, false))
      })
    })
  })

  describe('Background refresh', () => {
    it('should utilize short poll for fetching new data with 2 seconds delay between fetches', () => {
      mountListOfVehicles()

      cy.then(() => {
        expect(shortPollStub.args[0][0]).to.equal(VehicleList.fetchAll)
        expect(shortPollStub.args[0][2]).to.equal(2000)
      })
    })

    const scenarios = {
      'given two vehicles when first one updates it should re-render it': {
        initial: [firstGeoLocatedVehicle, secondGeoLocatedVehicle],
        update: [updatedFirstGeoLocatedVehicle, secondGeoLocatedVehicle],
        expected: [updatedFirstGeoLocatedVehicle, secondGeoLocatedVehicle]
      },

      'given two vehicles when second one updates it should re-render it': {
        initial: [firstGeoLocatedVehicle, secondGeoLocatedVehicle],
        update: [firstGeoLocatedVehicle, updatedSecondGeoLocatedVehicle],
        expected: [firstGeoLocatedVehicle, updatedSecondGeoLocatedVehicle]
      },

      // if user has n vehicles and suddenly server says they have none,
      // assume something went wrong and instead of deleting them from the screen
      // keep them rendered with the last known state
      'given n (2) vehicles when they all get deleted assume something went wrong and do not delete vehicles': {
        initial: [firstGeoLocatedVehicle, secondGeoLocatedVehicle],
        update: [],
        expected: [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      },

      'given two vehicles when one of them gets deleted then delete it from the screen': {
        initial: [firstGeoLocatedVehicle, secondGeoLocatedVehicle],
        update: [firstGeoLocatedVehicle],
        expected: [firstGeoLocatedVehicle]
      }
    }

    for (const [caseDescription, data] of Object.entries(scenarios)) {
      specify(caseDescription, () => {
        const initialVehicles = data.initial
        const updatedVehicles = data.update
        const expectedVehiclesAfterUpdate = data.expected

        const { fetchVehiclesStub, waitForComponentsRerender } = simulateFetchedVehicles(updatedVehicles)
        restoreShortPoll()

        mountListOfVehicles({ vehicles: initialVehicles })
        assertRenderedVehiclesAre(initialVehicles)

        cy.wrap(fetchVehiclesStub).should('have.been.calledOnce')
        waitForComponentsRerender()
        assertRenderedVehiclesAre(expectedVehiclesAfterUpdate)

        stopShortPoll()
      })
    }
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
      expect(allGeoLocatedVehicleComponents.length).to.equal(vehicles.length)
      return allGeoLocatedVehicleComponents
    })
    .then(allGeoLocatedVehicleComponents => {
      allGeoLocatedVehicleComponents.forEach((component, i) => assertGeoLocatedVehicleProps(component, vehicles[i]))
    })
}

function assertGeoLocatedVehicleProps (vehicleComponent: GeoLocatedVehicleWrapper, expectedVehicle: Vehicle) {
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

function getVehicleCardByIndex (index: number) {
  return cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle)[index])
    .then(firstVehicle => cy.wrap(firstVehicle.element))
}

function getVehicleHeight (alias: string) {
  return cy.get('@' + alias).invoke('outerHeight').then(vehicleHeight => cy.wrap(vehicleHeight))
}

function getVehicleContainerHeight () {
  return cy.dataCy('vehicle-container').invoke('outerHeight').then(height => height as unknown as number)
}

function assertNotInSingleVehicleView () {
  cy.get('*[data-cy^="vehicle-"]').should('be.visible')
}

function openInSingleVehicleView (targetVehicle: Vehicle) {
  cy.dataCy(`vehicle-${targetVehicle.id()}`).click()
}

function mapInteractivityShouldBe (component: GeoLocatedVehicleWrapper, wantedInteractivity: boolean) {
  cy.then(() => component.props('mapInteractive') as boolean)
    .then(interactive => cy.wrap(interactive))
    .should('equal', wantedInteractivity)
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
  const delayNeededForComponentsRerender = 150

  const fetchVehiclesStub = cy.stub(VehicleList, 'fetchAll').callsFake(async () => {
    await sleep.now(delayNeededForComponentsRerender)
    return vehicles
  })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  const waitForComponentsRerender = () => cy.wait(delayNeededForComponentsRerender)

  return { fetchVehiclesStub, waitForComponentsRerender }
}
