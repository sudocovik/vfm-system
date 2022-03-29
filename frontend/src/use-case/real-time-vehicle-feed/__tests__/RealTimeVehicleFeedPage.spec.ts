import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import ListOfNotInstalledVehicles from '../ListOfNotInstalledVehicles.vue'
import { VehicleWithoutPosition } from 'src/backend/VehicleService'
import { mount } from '@cypress/vue'

describe('RealTimeVehicleFeedPage', () => {
  inAllLanguages.it('should have a title', (t) => {
    mountRealTimeVehicleFeedPage()

    cy.validateTitle(t('vehicles'))
    cy.get('.title').should('have.text', t('vehicles'))
  })

  it('should be visible on / route', () => {
    cy.then(async () => {
      const route = routes.find(route => route.path === '/')

      if (!route) throw new Error('Route for real time vehicle feed not found')

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((await route.component()).default).to.equal(RealTimeVehicleFeedPage)
    })
  })

  it('should have a list of not installed vehicles', () => {
    mountRealTimeVehicleFeedPage()

    cy.then(() => {
      const listOfNotInstalledVehicles = Cypress.vueWrapper.findComponent(ListOfNotInstalledVehicles)

      expect(listOfNotInstalledVehicles.exists()).to.equal(true)
    })
  })

  it('should have a couple of dummy not installed vehicles', () => {
    mountRealTimeVehicleFeedPage()

    cy.then(() => {
      const listOfNotInstalledVehicles = Cypress.vueWrapper.findComponent(ListOfNotInstalledVehicles)
      const vehicles = (<unknown[]>listOfNotInstalledVehicles.props('vehicles'))

      expect(vehicles).to.have.length(3)
      expect(vehicles.every(vehicle => vehicle instanceof VehicleWithoutPosition)).to.equal(true)
    })
  })
})

function mountRealTimeVehicleFeedPage () {
  mount(RealTimeVehicleFeedPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true
      }
    }
  })
}
