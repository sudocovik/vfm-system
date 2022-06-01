import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import { mount } from '@cypress/vue'
import { QPage } from 'quasar'
import NoVehiclesFound from '../NoVehiclesFound.vue'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from '../ListOfVehicles.vue'
import VehiclesLoadingIndicator from '../VehiclesLoadingIndicator.vue'

const stateComponentMap = {
  loading: VehiclesLoadingIndicator,
  empty: NoVehiclesFound,
  error: FailedToFetchData,
  success: ListOfVehicles
} as const
type State = keyof typeof stateComponentMap
type ComponentFromState = typeof stateComponentMap[State]

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

        assertComponentExists(VehiclesLoadingIndicator)
      })
    })

    describe('Empty state', () => {
      it('should render NoVehiclesFound component', () => {
        mountRealTimeVehicleFeedPage()

        assertComponentExists(NoVehiclesFound)
      })
    })

    describe('Error state', () => {
      it('should render FailedToFetchData component', () => {
        mountRealTimeVehicleFeedPage()

        assertComponentExists(FailedToFetchData)
      })
    })

    describe('Loaded state', () => {
      it('should render ListOfVehicles component', () => {
        mountRealTimeVehicleFeedPage()

        assertComponentExists(ListOfVehicles)
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

function assertComponentExists (component: ComponentFromState) {
  cy.then(() => Cypress.vueWrapper.findComponent(component))
    .then(noVehiclesFound => noVehiclesFound.exists())
    .then(exists => cy.wrap(exists))
    .should('equal', true)
}
