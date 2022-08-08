import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import { mount } from '@cypress/vue'
import { QPage } from 'quasar'
import { StateMachine, STATES } from '../StateMachine'
import { GeoLocatedVehicle, Position, VehicleList } from 'src/backend/VehicleService'
import { Speed } from 'src/support/measurement-units/speed'
import type { SinonStub } from 'cypress/types/sinon'
import { firstGeoLocatedVehicle, secondGeoLocatedVehicle } from '../__fixtures__/geo-located-vehicles'
import ListOfVehicles from '../ListOfVehicles.vue'
import { shortPoll } from 'src/support/short-poll'

const stateSelectorMap = {
  [STATES.LOADING]: 'loading-indicator',
  [STATES.EMPTY]: 'no-vehicles',
  [STATES.ERROR]: 'fetch-failure',
  [STATES.SUCCESS]: 'vehicle-list'
} as const
type State = keyof typeof stateSelectorMap

let vehicleFetchStub: SinonStub

describe('RealTimeVehicleFeedPage', () => {
  beforeEach(resetStateMachine)
  beforeEach(stubVehicleFetching)
  beforeEach(stubShortPoll)

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

        assertStateIs(STATES.LOADING)
      })
    })

    describe('Empty state', () => {
      it('should render NoVehiclesFound component', () => {
        simulateEmptyState()

        mountRealTimeVehicleFeedPage()

        assertStateIs(STATES.EMPTY)
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

        assertStateIs(STATES.SUCCESS)
      })
    })
  })

  describe('State transitions', () => {
    it(`${STATES.LOADING} -> ${STATES.EMPTY}`, () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs(STATES.LOADING)

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.EMPTY)
      })

      assertStateIs(STATES.EMPTY)
    })

    it(`${STATES.LOADING} -> ${STATES.ERROR}`, () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs(STATES.LOADING)

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.ERROR)
      })

      assertStateIs('error')
    })

    it(`${STATES.LOADING} -> ${STATES.SUCCESS}`, () => {
      const { endSimulation } = simulateLoadingState()
      mountRealTimeVehicleFeedPage()
      assertStateIs(STATES.LOADING)

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.SUCCESS)
      })

      assertStateIs(STATES.SUCCESS)
    })

    it(`${STATES.ERROR} -> ${STATES.LOADING}`, () => {
      const { endSimulation } = simulateErrorState()
      mountRealTimeVehicleFeedPage()
      assertStateIs(STATES.ERROR)

      cy.then(() => {
        endSimulation()
        StateMachine.transitionTo(STATES.LOADING)
      })

      assertStateIs(STATES.LOADING)
    })
  })

  describe('Behavior', () => {
    it(`should initially be in ${STATES.LOADING} state`, () => {
      preventStateTransitions()

      mountRealTimeVehicleFeedPage()

      assertStateIs(STATES.LOADING)
    })

    it(`should go to ${STATES.EMPTY} state if backend request returns empty array`, () => {
      simulateResultFromBackend([])

      mountRealTimeVehicleFeedPage()

      assertStateIs(STATES.EMPTY)
    })

    it(`should go to ${STATES.ERROR} state if backend request fails`, () => {
      simulateExceptionFromBackend()

      mountRealTimeVehicleFeedPage()

      assertStateIs(STATES.ERROR)
    })

    const samplePosition = new Position(1, 1, 44.12, 15.63, 140, 70, Speed.fromKph(50), 'Test address', true, true, '2022-01-01 0:00:00', '2022-01-01 0:00:00', '2022-01-01 0:00:00')
    const sampleVehicle = new GeoLocatedVehicle(1, 'ZD-000-AA', '123456789', true, samplePosition)

    it(`should go to ${STATES.SUCCESS} state if backend request returns at least one vehicle`, () => {
      simulateResultFromBackend([sampleVehicle])

      mountRealTimeVehicleFeedPage()

      assertStateIs(STATES.SUCCESS)
    })

    it(`should pass vehicles from backend request to ListOfVehicles component when in ${STATES.SUCCESS} state`, () => {
      const vehiclesFromBackend = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      simulateResultFromBackend([firstGeoLocatedVehicle, secondGeoLocatedVehicle])

      mountRealTimeVehicleFeedPage()

      cy.then(() => Cypress.vueWrapper.findComponent(ListOfVehicles))
        .then(component => component.props('vehicles') as GeoLocatedVehicle[])
        .then(vehicles => cy.wrap(vehicles))
        .should('deep.equal', vehiclesFromBackend)
    })
  })
})

function mountRealTimeVehicleFeedPage () {
  mount(RealTimeVehicleFeedPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true,
        BaseMap: true
      }
    }
  })
}

function assertStateIs (targetState: State) {
  const targetSelector = stateSelectorMap[targetState]
  const allSelectorsMinusTargetSelector = Object.values(stateSelectorMap).filter(component => component !== targetSelector)

  cy.dataCy(targetSelector).should('exist')
  allSelectorsMinusTargetSelector.forEach(selector => void cy.dataCy(selector).should('not.exist'))
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

function preventStateTransitions () {
  cy.stub(StateMachine, 'transitionTo')
}

function resetStateMachine () {
  StateMachine.reset()
}

function stubVehicleFetching () {
  vehicleFetchStub = cy.stub(VehicleList, 'fetchAll').resolves()
}

function stubShortPoll () {
  cy.stub(shortPoll, 'do').callsFake(() => {
    return () => { /* make sure onUnmounted does not throw exception */ }
  })
}

function simulateResultFromBackend (result: GeoLocatedVehicle[]) {
  vehicleFetchStub.resolves(result)
}

function simulateExceptionFromBackend () {
  vehicleFetchStub.rejects()
}
