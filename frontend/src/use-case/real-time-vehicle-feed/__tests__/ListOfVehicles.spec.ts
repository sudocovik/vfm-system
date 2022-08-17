import { ComponentProps, ComponentUnderTest, getComponentKey, inAllLanguages } from 'test/support/api'
import ListOfVehicles from '../ListOfVehicles.vue'
import GeoLocatedVehicle from '../GeoLocatedVehicle.vue'
import { VueWrapper } from '@vue/test-utils'
import { GeoLocatedVehicle as Vehicle } from 'src/backend/VehicleService'
import {
  firstGeoLocatedVehicle,
  secondGeoLocatedVehicle,
  thirdGeoLocatedVehicle,
  updatedFirstGeoLocatedVehicle,
  updatedSecondGeoLocatedVehicle
} from '../__fixtures__/geo-located-vehicles'

type GeoLocatedVehicleWrapper = VueWrapper<InstanceType<typeof GeoLocatedVehicle>>
type ListOfVehiclesProps = ComponentProps<typeof ListOfVehicles>

describe('ListOfVehicles', () => {
  specify('given list of non-vehicles it should render nothing', () => {
    const gibberish = [false, null, undefined, 'lol', -1]

    mountListOfVehicles({ vehicles: gibberish })

    cy.dataCy('root-node').should('not.have.html')
  })

  specify('given list of single vehicle it should render it', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(getAllGeoLocatedVehicles)
      .then(component => assertGeoLocatedVehicleProps(component[0], firstGeoLocatedVehicle))
  })

  specify('given list of two vehicles it should render both of them', () => {
    const vehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    assertRenderedVehiclesAre(vehicles)
  })

  specify('given list of two vehicles when they change then re-render', () => {
    const initialVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
    const updatedVehicles = [updatedFirstGeoLocatedVehicle, updatedSecondGeoLocatedVehicle]

    mountListOfVehicles({ vehicles: initialVehicles })
    assertRenderedVehiclesAre(initialVehicles)

    cy.then(() => changeVehicles(updatedVehicles))
    assertRenderedVehiclesAre(updatedVehicles)
  })

  it('should render vehicles under root node', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(getAllGeoLocatedVehicles)
      .then(component => component[0].element as unknown as JQuery)
      .then(element => element[0].outerHTML)
      .then(html => cy.dataCy('root-node').should('contain.html', html))
  })

  specify('user should not be able to pan the map and change zoom', () => {
    mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

    cy.then(getAllGeoLocatedVehicles)
      .each((vehicleComponent: GeoLocatedVehicleWrapper) => mapInteractivityShouldBe(vehicleComponent, false))
  })

  specify('map center should follow marker position', () => {
    mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

    cy.then(getAllGeoLocatedVehicles)
      .each((vehicleComponent: GeoLocatedVehicleWrapper) => mapSyncCenterShouldBe(vehicleComponent, true))
  })

  specify('vehicles should have pointer cursor', () => {
    mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

    cy.get('[data-cy^="vehicle-"]').each($vehicle => expect($vehicle).to.have.css('cursor', 'pointer'))
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
    it('should go to single vehicle mode', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      assertNotSingleVehicleMode()

      openInSingleVehicleMode(firstGeoLocatedVehicle)

      assertIsSingleVehicleMode()
    })

    const targetVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
    targetVehicles.forEach(targetVehicle => {
      it(`should display target vehicle: ${targetVehicle.licensePlate()}`, () => {
        mountListOfVehicles({ vehicles: targetVehicles })

        openInSingleVehicleMode(targetVehicle)

        assertVehicleInSingleVehicleModeIs(targetVehicle)
      })

      it(`should have component key based on vehicle ID to prevent state drift: ${targetVehicle.licensePlate()}`, () => {
        mountListOfVehicles({ vehicles: targetVehicles })

        openInSingleVehicleMode(targetVehicle)

        cy.then(getSingleVehicleModeComponent)
          .then(targetVehicleComponent => getComponentKey(targetVehicleComponent))
          .then(componentKey => cy.wrap(componentKey))
          .should('equal', `single-vehicle-${targetVehicle.id()}`)
      })
    })

    it('should re-render component when there is data changes from background refresh', function () {
      const initialVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      const updatedVehicles = [updatedFirstGeoLocatedVehicle, secondGeoLocatedVehicle]

      mountListOfVehicles({ vehicles: initialVehicles })

      openInSingleVehicleMode(firstGeoLocatedVehicle)
      assertVehicleInSingleVehicleModeIs(firstGeoLocatedVehicle)

      cy.then(() => changeVehicles(updatedVehicles))
      assertVehicleInSingleVehicleModeIs(updatedFirstGeoLocatedVehicle)
    })

    specify('user should be able to pan the map and change zoom', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      openInSingleVehicleMode(firstGeoLocatedVehicle)

      cy.then(getSingleVehicleModeComponent)
        .then(singleVehicleModeComponent => mapInteractivityShouldBe(singleVehicleModeComponent, true))
    })

    specify('map center should not follow marker position', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      openInSingleVehicleMode(firstGeoLocatedVehicle)

      cy.then(getSingleVehicleModeComponent)
        .then(singleVehicleModeComponent => mapSyncCenterShouldBe(singleVehicleModeComponent, false))
    })

    it('should show back button', () => {
      mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })

      openInSingleVehicleMode(firstGeoLocatedVehicle)

      cy.dataCy('back-button').should('be.visible')
    })

    describe('when user clicks on back button', () => {
      it('should return to all vehicles view', () => {
        mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })
        openInSingleVehicleMode(firstGeoLocatedVehicle)

        leaveSingleVehicleMode()

        assertNotSingleVehicleMode()
      })

      it('should hide back button', () => {
        mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, secondGeoLocatedVehicle] })
        openInSingleVehicleMode(firstGeoLocatedVehicle)

        leaveSingleVehicleMode()

        cy.dataCy('back-button').should('not.be.visible')
      })

      const targetVehicles = [secondGeoLocatedVehicle, thirdGeoLocatedVehicle]
      targetVehicles.forEach(targetVehicle => {
        it(`should return to the same scroll position where it was before single vehicle mode: ${targetVehicle.licensePlate()}`, () => {
          let scrollPosition = 0
          mountListOfVehicles({ vehicles: [firstGeoLocatedVehicle, ...targetVehicles] })

          cy.dataCy(`vehicle-${targetVehicle.id()}`).scrollIntoView()
          cy.window().its('scrollY').then(scrollY => (scrollPosition = scrollY))

          openInSingleVehicleMode(targetVehicle)
          leaveSingleVehicleMode()

          cy.then(() => {
            cy.wrap(scrollPosition).should('be.greaterThan', 0)
            cy.window().its('scrollY').should('be.closeTo', scrollPosition, 2)
          })
        })
      })
    })
  })
})

function mountListOfVehicles (props?: ListOfVehiclesProps) {
  const defaultProps = { vehicles: [] }
  const allProps = { ...defaultProps, ...props }

  cy.mount(ListOfVehicles, {
    props: allProps,
    global: {
      stubs: {
        BaseMap: true
      }
    }
  })
}

function getAllGeoLocatedVehicles () {
  return Cypress.vueWrapper.findAllComponents('[data-cy^="vehicle-"]') as unknown as GeoLocatedVehicleWrapper[]
}

function assertRenderedVehiclesAre (vehicles: Vehicle[]) {
  cy.window().should(() => {
    const vehicleComponents = getAllGeoLocatedVehicles()
    expect(vehicleComponents.length, 'vehicle count').to.equal(vehicles.length)
    vehicleComponents.forEach((component, i) => assertGeoLocatedVehicleProps(component, vehicles[i]))
  })
}

function assertGeoLocatedVehicleProps (
  vehicleComponent: GeoLocatedVehicleWrapper,
  expectedVehicle: Vehicle,
  expectedKey: string | undefined = undefined
) {
  expect(getComponentKey(vehicleComponent), 'component key').to.equal(expectedKey ?? expectedVehicle.id())
  expect(vehicleComponent.props('licensePlate'), 'license plate').to.equal(expectedVehicle.licensePlate())
  expect(vehicleComponent.props('latitude'), 'latitude').to.equal(expectedVehicle.latitude())
  expect(vehicleComponent.props('longitude'), 'longitude').to.equal(expectedVehicle.longitude())
  expect(vehicleComponent.props('address'), 'address').to.equal(expectedVehicle.address())
  expect(vehicleComponent.props('speed'), 'speed').to.deep.equal(expectedVehicle.speed())
  expect(vehicleComponent.props('ignition'), 'ignition').to.equal(expectedVehicle.ignition())
  expect(vehicleComponent.props('moving'), 'moving').to.equal(expectedVehicle.moving())
  expect(vehicleComponent.props('course'), 'course').to.equal(expectedVehicle.course())
}

function mapInteractivityShouldBe (component: GeoLocatedVehicleWrapper, wantedInteractivity: boolean) {
  cy.then(() => component.props('mapInteractive') as boolean)
    .then(interactive => cy.wrap(interactive))
    .should(actual => {
      expect(actual, 'map interactivity').to.equal(wantedInteractivity)
    })
}

function mapSyncCenterShouldBe (component: GeoLocatedVehicleWrapper, wantedSyncStatus: boolean) {
  cy.then(() => component.props('syncCenter') as boolean)
    .then(syncCenter => cy.wrap(syncCenter))
    .should(actual => {
      expect(actual, 'sync center').to.equal(wantedSyncStatus)
    })
}

function assertIsSingleVehicleMode () {
  cy.get('[data-cy="single-vehicle-mode"]').should('exist')
  cy.get('[data-cy^="vehicle-"]').should('not.be.visible')
}

function assertNotSingleVehicleMode () {
  cy.get('[data-cy="single-vehicle-mode"]').should('not.exist')
  cy.get('[data-cy^="vehicle-"]').should('be.visible')
}

function getSingleVehicleModeComponent () {
  return Cypress.vueWrapper.getComponent('[data-cy="single-vehicle-mode"]') as unknown as GeoLocatedVehicleWrapper
}

function openInSingleVehicleMode (targetVehicle: Vehicle) {
  cy.dataCy(`vehicle-${targetVehicle.id()}`).click()
}

function leaveSingleVehicleMode () {
  cy.dataCy('back-button').click()
}

function assertVehicleInSingleVehicleModeIs (targetVehicle: Vehicle) {
  cy.window().should(() => {
    const component = getSingleVehicleModeComponent()
    const targetComponentKey = `single-vehicle-${targetVehicle.id()}`
    assertGeoLocatedVehicleProps(component, targetVehicle, targetComponentKey)
  })
}

function changeVehicles (vehicles: unknown[]) {
  ComponentUnderTest.changeProperties({ vehicles })
}
