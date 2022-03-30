import { ComponentUnderTest } from 'test/support/api'
import GeoLocatedVehicle from '../GeoLocatedVehicle.vue'

describe('GeoLocatedVehicle', () => {
  it('should render license plate', () => {
    ComponentUnderTest.is(GeoLocatedVehicle).mount()

    cy.dataCy('license-plate').should('have.text', 'ZD000AA')
  })

  describe('Movement states', () => {
    const movementStates = [
      { moving: false, icon: 'mdi-truck' },
      { moving: true, icon: 'mdi-truck-fast' }
    ]
    movementStates.forEach(({ moving, icon }) => {
      it(`should render '${icon}' icon when ${moving ? 'moving' : 'not moving'}`, () => {
        ComponentUnderTest.is(GeoLocatedVehicle).withProperties({ moving }).mount()

        cy.dataCy('icon').invoke('hasClass', icon).should('equal', true)
      })
    })
  })

  it('should render address', () => {
    ComponentUnderTest.is(GeoLocatedVehicle).mount()

    cy.dataCy('address').should('have.text', 'Ulica Ante Starčevića 1a, 23000 Zadar, HR')
  })

  it('should render speed', () => {
    ComponentUnderTest.is(GeoLocatedVehicle).mount()

    cy.dataCy('speed').should('have.text', '30 km/h')
  })
})
