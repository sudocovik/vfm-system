import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import { mount } from '@cypress/vue'
import { QPage } from 'quasar'
import { StateMachine, STATES } from '../StateMachine'
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
        simulateLoadingState()

        mountRealTimeVehicleFeedPage()

        assertStateIs('loading')
      })
    })

    describe('Empty state', () => {
      it('should render NoVehiclesFound component', () => {
        simulateEmptyState()

        mountRealTimeVehicleFeedPage()

        assertStateIs('empty')
      })
    })

    describe('Error state', () => {
      it('should render FailedToFetchData component', () => {
        simulateErrorState()

        mountRealTimeVehicleFeedPage()

        assertStateIs('error')
      })
    })

    describe('Success state', () => {
      it('should render ListOfVehicles component', () => {
        simulateSuccessState()

        mountRealTimeVehicleFeedPage()

        assertStateIs('success')
      })
    })
  })

  describe('State transitions', () => {
    it('loading -> empty', () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs('loading')

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.EMPTY)
      })

      assertStateIs('empty')
    })

    it('loading -> error', () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs('loading')

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.ERROR)
      })

      assertStateIs('error')
    })

    it('loading -> success', () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs('loading')

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.SUCCESS)
      })

      assertStateIs('success')
    })

    it('error -> loading', () => {
      const { endSimulation } = simulateErrorState()
      mountRealTimeVehicleFeedPage()
      assertStateIs('error')

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.LOADING)
      })

      assertStateIs('loading')
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
  cy.then(() => Cypress.vueWrapper.findComponent(component).exists())
    .then(exists => cy.wrap(exists))
    .should('equal', true)
}

function assertComponentDoesNotExist (component: ComponentFromState) {
  cy.then(() => Cypress.vueWrapper.findComponent(component).exists())
    .then(exists => cy.wrap(exists))
    .should('equal', false)
}

function assertStateIs (targetState: State) {
  const targetComponent = stateComponentMap[targetState]
  const components = Object.values(stateComponentMap).filter(component => component !== targetComponent)

  assertComponentExists(targetComponent)
  components.forEach(component => assertComponentDoesNotExist(component))
}

function simulateLoadingState () {
  const state = cy.stub(StateMachine, 'currentState').returns(STATES.LOADING)

  return { endSimulation: () => state.restore() }
}

function simulateEmptyState () {
  cy.stub(StateMachine, 'currentState').returns(STATES.EMPTY)
}

function simulateErrorState () {
  const state = cy.stub(StateMachine, 'currentState').returns(STATES.ERROR)

  return { endSimulation: () => state.restore() }
}

function simulateSuccessState () {
  cy.stub(StateMachine, 'currentState').returns(STATES.SUCCESS)
}
