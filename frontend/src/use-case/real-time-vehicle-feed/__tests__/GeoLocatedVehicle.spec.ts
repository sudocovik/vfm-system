import { mount } from '@cypress/vue'
import GeoLocatedVehicle, { MAP_HEIGHT } from '../GeoLocatedVehicle.vue'
import BaseMap from 'components/BaseMap.vue'
import { ComponentUnderTest } from 'test/support/api'

describe('GeoLocatedVehicle', () => {
  it('should render BaseMap', () => {
    mountGeoLocatedVehicle()

    cy.then(() => {
      const baseMap = getBaseMap()
      expect(baseMap.exists()).to.equal(true)
    })
  })

  describe('License plate', () => {
    const licensePlates = ['ZD000AA', 'ZD111AA']
    const licensePlateShouldBe = (licensePlate: string) => cy.dataCy('license-plate').should('have.text', licensePlate)

    licensePlates.forEach(licensePlate => {
      it(`should render license plate '${licensePlate}'`, () => {
        mountGeoLocatedVehicle({ licensePlate })

        licensePlateShouldBe(licensePlate)
      })
    })

    it('should be reactive', () => {
      const firstLicensePlate = licensePlates[0]
      const secondLicensePlate = licensePlates[1]
      mountGeoLocatedVehicle({ licensePlate: firstLicensePlate })
      licensePlateShouldBe(firstLicensePlate)

      ComponentUnderTest.changeProperties({ licensePlate: secondLicensePlate })
      licensePlateShouldBe(secondLicensePlate)
    })
  })

  describe('Movement states', () => {
    const movementStates = [
      { moving: false, icon: 'mdi-truck' },
      { moving: true, icon: 'mdi-truck-fast' }
    ]
    movementStates.forEach(({ moving, icon }) => {
      it(`should render '${icon}' icon when ${moving ? 'moving' : 'not moving'}`, () => {
        mountGeoLocatedVehicle({ moving })

        cy.dataCy('icon').invoke('hasClass', icon).should('equal', true)
      })
    })
  })

  it('should render address', () => {
    mountGeoLocatedVehicle()

    cy.dataCy('address').should('have.text', 'Ulica Ante Starčevića 1a, 23000 Zadar, HR')
  })

  it('should render speed', () => {
    mountGeoLocatedVehicle()

    cy.dataCy('speed').should('have.text', '30 km/h')
  })

  describe('Map', () => {
    it(`should be ${String(MAP_HEIGHT)}px high`, () => {
      mountGeoLocatedVehicle()

      mapHeightShouldBe(MAP_HEIGHT)
    })

    it('should be 100% wide', () => {
      mountGeoLocatedVehicle()

      mapWidthShouldBe('100%')
    })

    it('should respect q-card\'s border radius', () => {
      mountGeoLocatedVehicle()

      mapOverflowShouldBe('hidden')
    })
  })
})

function mountGeoLocatedVehicle (props?: Record<string, unknown>) {
  // For some reason, after adding 'licensePlate' as required property, TS complains 'props' object does not exist...
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mount(GeoLocatedVehicle, {
    global: {
      stubs: {
        BaseMap: true
      }
    },
    props
  })
}

function getBaseMap () {
  return Cypress.vueWrapper.findComponent(BaseMap)
}

function mapWidthShouldBe (expectedWidth: string) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('css', 'width')
    .should('equal', expectedWidth)
}

function mapHeightShouldBe (expectedHeight: number) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('outerHeight')
    .should('equal', expectedHeight)
}

function mapOverflowShouldBe (expectedOverflow: string) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('css', 'overflow')
    .should('equal', expectedOverflow)
}
