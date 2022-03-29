import { ComponentUnderTest } from 'test/support/api'
import ListOfNotInstalledVehicles from '../ListOfNotInstalledVehicles.vue'
import { VehicleWithoutPosition } from 'src/backend/VehicleService'
import NotInstalledVehicle from '../NotInstalledVehicle.vue'
import { VueWrapper } from '@vue/test-utils'

const appropriateVehicles = [
  new VehicleWithoutPosition(1, 'ZD000AA', '000000', false),
  new VehicleWithoutPosition(2, 'ZD111BB', '111111', false)
]

describe('ListOfNotInstalledVehicles', () => {
  it('should not render vehicles given list of empty vehicles', () => {
    ComponentUnderTest.is(ListOfNotInstalledVehicles).withProperties({ vehicles: [] }).mount()

    cy.then(() => {
      const renderedVehicles = Cypress.vueWrapper.findAllComponents(NotInstalledVehicle)
      expect(renderedVehicles).to.have.length(0)
    })
  })

  it('should render only vehicles without GPS tracker installed', () => {
    const vehicles = [
      ...appropriateVehicles,
      { licensePlate: 'ZD-FAKE-00' }
    ]

    ComponentUnderTest.is(ListOfNotInstalledVehicles).withProperties({ vehicles }).mount()

    cy.then(() => {
      const renderedVehicles = Cypress.vueWrapper.findAllComponents(NotInstalledVehicle)
      expect(renderedVehicles.length).to.equal(appropriateVehicles.length)

      appropriateVehicles.forEach((vehicle, i) => {
        const componentKey = getComponentKey(renderedVehicles[i])
        const nameProperty = <string>renderedVehicles[i].props('name')

        expect(componentKey).to.equal(vehicle.id())
        expect(nameProperty).to.equal(vehicle.licensePlate())
      })
    })
  })

  describe('should apply class to all children NotInstalledVehicle components', () => {
    (['my-first-class', 'my-second-class']).forEach((targetClass, i) => {
      it(`case ${i + 1}: class named '${targetClass}'`, () => {
        ComponentUnderTest.is(ListOfNotInstalledVehicles)
          .withProperties({ vehicles: appropriateVehicles })
          .withAttributes({ class: targetClass })
          .mount()

        cy.then(() => {
          const notInstalledVehicleComponents = Cypress.vueWrapper.findAllComponents(NotInstalledVehicle)
          notInstalledVehicleComponents.forEach(component => expect(component.classes()).includes(targetClass))
        })
      })
    })
  })
})

function getComponentKey (component: VueWrapper) {
  type VmOptions = {
    $: {
      vnode: {
        key: number
      }
    }
  }

  return (<VmOptions>component.vm).$.vnode.key
}
