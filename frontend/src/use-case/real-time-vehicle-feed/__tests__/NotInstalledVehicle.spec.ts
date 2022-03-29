import { ComponentUnderTest } from 'test/support/api'
import NotInstalledVehicle from '../NotInstalledVehicle.vue'

describe('NotInstalledVehicle', () => {
  describe('should display vehicle license plate', () => {
    ['ZD123AB', 'ZD321BA'].forEach(licensePlate => {
      it(licensePlate, () => {
        ComponentUnderTest.is(NotInstalledVehicle).withProperties({
          name: licensePlate
        }).mount()

        cy.get('.vehicle-license-plate')
          .should('have.text', licensePlate)
      })
    })
  })
})
