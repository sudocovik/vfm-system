import { ComponentUnderTest } from 'test/support/api'
import ListOfNotInstalledVehicles from '../ListOfNotInstalledVehicles.vue'
import { VehicleWithoutPosition } from 'src/backend/VehicleService'
import NotInstalledVehicle from '../NotInstalledVehicle.vue'
import { VueWrapper } from '@vue/test-utils'

describe('ListOfNotInstalledVehicles', () => {
  it('should not render vehicles given list of empty vehicles', () => {
    ComponentUnderTest.is(ListOfNotInstalledVehicles).withProperties({ vehicles: [] }).mount()

    cy.then(() => {
      const renderedVehicles = Cypress.vueWrapper.findAllComponents(NotInstalledVehicle)
      expect(renderedVehicles).to.have.length(0)
    })
  })

  it('should render only vehicles without GPS tracker installed', () => {
    const appropriateVehicle = new VehicleWithoutPosition(1, 'ZD000AA', '000000', false)
    const vehicles = [
      appropriateVehicle,
      { licensePlate: 'ZD1111BB' }
    ]

    ComponentUnderTest.is(ListOfNotInstalledVehicles).withProperties({ vehicles }).mount()

    cy.then(() => {
      const renderedVehicles = Cypress.vueWrapper.findAllComponents(NotInstalledVehicle)
      expect(renderedVehicles).to.have.length(1)

      const firstVehicle = renderedVehicles[0]
      expect(firstVehicle.props('name')).to.equal(appropriateVehicle.licensePlate())
    })
  })
})
