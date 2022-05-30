import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import { mount } from '@cypress/vue'
import { QPage } from 'quasar'
import VehicleSkeletonLoader from '../VehicleSkeletonLoader.vue'
import NoVehiclesFound from '../NoVehiclesFound.vue'
import FailedToFetchData from 'components/FailedToFetchData.vue'

describe('RealTimeVehicleFeedPage', () => {
  inAllLanguages.it('should have a title', (t) => {
    mountRealTimeVehicleFeedPage()

    cy.validateTitle(t('vehicles'))
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

  it('should be a page', () => {
    mountRealTimeVehicleFeedPage()

    cy.then(() => Cypress.vueWrapper.findComponent(QPage))
      .then(component => component.exists())
      .then(exists => cy.wrap(exists))
      .should('equal', true)
  })

  describe('States', () => {
    describe('Loading state', () => {
      it('should render two skeleton loaders', () => {
        mountRealTimeVehicleFeedPage()

        cy.then(() => Cypress.vueWrapper.findAllComponents(VehicleSkeletonLoader))
          .then(skeletons => skeletons.length)
          .then(count => cy.wrap(count))
          .should('equal', 2)
      })
    })

    describe('Empty state', () => {
      it('should render NoVehiclesFound component', () => {
        mountRealTimeVehicleFeedPage()

        cy.then(() => Cypress.vueWrapper.findComponent(NoVehiclesFound))
          .then(noVehiclesFound => noVehiclesFound.exists())
          .then(exists => cy.wrap(exists))
          .should('equal', true)
      })
    })

    describe('Error state', () => {
      it('should render FailedToFetchData component', () => {
        mountRealTimeVehicleFeedPage()

        cy.then(() => Cypress.vueWrapper.findComponent(FailedToFetchData))
          .then(noVehiclesFound => noVehiclesFound.exists())
          .then(exists => cy.wrap(exists))
          .should('equal', true)
      })
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
