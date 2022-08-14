import { inAllLanguages } from 'test/support/api'
import RealTimeVehicleFeedPage from '../RealTimeVehicleFeedPage.vue'
import routes from 'src/router/routes'
import { QPage } from 'quasar'
import { VehicleList } from 'src/backend/VehicleService'
import type { SinonStub } from 'cypress/types/sinon'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from '../ListOfVehicles.vue'
import NoVehiclesFound from '../NoVehiclesFound.vue'
import VehiclesLoadingIndicator from '../VehiclesLoadingIndicator.vue'
import { firstGeoLocatedVehicle, secondGeoLocatedVehicle } from '../__fixtures__/geo-located-vehicles'

let vehicleFetchStub: SinonStub
const SUCCESS_INTERVAL = 4000
const FAILURE_INTERVAL = 10000

describe('RealTimeVehicleFeedPage', () => {
  beforeEach(stubVehicleFetching)

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

  describe('States markup', () => {
    describe('Loading state', () => {
      beforeEach(simulateFetchNeverFinished)
      beforeEach(mountRealTimeVehicleFeedPage)

      specify('VehiclesLoadingIndicator should be a child of [data-cy="loading-indicator"]', () => {
        const getLoadingIndicators = () => cy.wrap(Cypress.vueWrapper.getComponent(VehiclesLoadingIndicator).element)

        cy.then(getLoadingIndicators)
          .then($loadingIndicators => cy.dataCy('loading-indicator').should('contain.html', $loadingIndicators.html()))
      })

      specify('only [data-cy="loading-indicator"] should be rendered', () => {
        assertPageHasOnlyOneChild('loading-indicator')
      })
    })

    describe('Error state', () => {
      beforeEach(simulateFetchFailed)
      beforeEach(mountRealTimeVehicleFeedPage)

      specify('FailedToFetchData should be a child of [data-cy="fetch-failure"]', () => {
        const getFailedToFetchData = () => cy.wrap(Cypress.vueWrapper.getComponent(FailedToFetchData).element)

        cy.then(getFailedToFetchData)
          .then($failedToFetchData => {
            cy.dataCy('fetch-failure').should('have.html', $failedToFetchData[0].outerHTML.trim())
          })
      })

      specify('only [data-cy="fetch-failure"] should be rendered', () => {
        assertPageHasOnlyOneChild('fetch-failure')
      })
    })

    describe('Empty state', () => {
      beforeEach(simulateFetchReturnedEmptyVehicleList)
      beforeEach(mountRealTimeVehicleFeedPage)

      specify('NoVehiclesFound should be a child of [data-cy="no-vehicles"]', () => {
        const getNoVehiclesFound = () => cy.wrap(Cypress.vueWrapper.getComponent(NoVehiclesFound).element)

        cy.then(getNoVehiclesFound)
          .then($noVehiclesFound => {
            cy.dataCy('no-vehicles').should('have.html', $noVehiclesFound[0].outerHTML.trim())
          })
      })

      specify('only [data-cy="no-vehicles"] should be rendered', () => {
        assertPageHasOnlyOneChild('no-vehicles')
      })
    })

    describe('Success state', () => {
      beforeEach(() => simulateFetchReturns([firstGeoLocatedVehicle]))
      beforeEach(mountRealTimeVehicleFeedPage)

      specify('ListOfVehicles should be a child of [data-cy="vehicle-list"]', () => {
        const getListOfVehicles = () => cy.wrap(Cypress.vueWrapper.getComponent(ListOfVehicles).element)

        cy.then(getListOfVehicles)
          .then($listOfVehicles => {
            cy.dataCy('vehicle-list').should('have.html', $listOfVehicles[0].outerHTML.trim())
          })
      })

      specify('only [data-cy="vehicle-list"] should be rendered', () => {
        assertPageHasOnlyOneChild('vehicle-list')
      })
    })
  })

  describe('Behavior', () => {
    it('should render loading indicators when fetching vehicles', () => {
      simulateFetchNeverFinished()

      mountRealTimeVehicleFeedPage()

      cy.dataCy('loading-indicator').should('be.visible')
    })

    it('should display meaningful message if vehicle fetch fails', () => {
      simulateFetchFailed()

      mountRealTimeVehicleFeedPage()

      cy.dataCy('fetch-failure').should('be.visible')
    })

    it('should allow user to retry fetching when it fails', () => {
      simulateFetchFailed()
      mountRealTimeVehicleFeedPage()
      cy.then(simulateFetchNeverFinished)
      cy.dataCy('retry').click()
      cy.dataCy('loading-indicator').should('be.visible')
      cy.wrap(vehicleFetchStub).should('have.been.calledTwice')
    })

    it('should display hardware is on the way if vehicle fetch returns no vehicles', () => {
      simulateFetchReturnedEmptyVehicleList()

      mountRealTimeVehicleFeedPage()

      cy.dataCy('no-vehicles').should('be.visible')
    })

    it('should render vehicles returned from backend', () => {
      const expectedVehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
      simulateFetchReturns(expectedVehicles)

      mountRealTimeVehicleFeedPage()

      cy.dataCy('vehicle-list').should('be.visible')
      assertRenderedVehiclesAre(expectedVehicles)
    })

    describe('Background refresh', () => {
      const [firstBatchOfVehicles, secondBatchOfVehicles, thirdBatchOfVehicles] = [
        [firstGeoLocatedVehicle, secondGeoLocatedVehicle],
        [firstGeoLocatedVehicle],
        [secondGeoLocatedVehicle]
      ]
      const controlTime = () => {
        cy.clock()
        return {
          advanceTimeByMilliseconds: (milliseconds: number) => cy.tick(milliseconds),
          allowAnimationsToRun: () => cy.then(() => cy.tick(1000))
        }
      }
      const nextBatchOfVehiclesIs = (vehicles: unknown[]) => cy.then(() => simulateFetchReturns(vehicles))

      it('should fetch data in the background every four seconds and render updates', () => {
        const { advanceTimeByMilliseconds } = controlTime()

        simulateFetchReturns(firstBatchOfVehicles)
        mountRealTimeVehicleFeedPage()
        assertRenderedVehiclesAre(firstBatchOfVehicles)

        nextBatchOfVehiclesIs(secondBatchOfVehicles)
        advanceTimeByMilliseconds(SUCCESS_INTERVAL - 1)
        assertRenderedVehiclesAre(firstBatchOfVehicles)
        advanceTimeByMilliseconds(1)
        assertRenderedVehiclesAre(secondBatchOfVehicles)

        nextBatchOfVehiclesIs(thirdBatchOfVehicles)
        advanceTimeByMilliseconds(SUCCESS_INTERVAL)
        assertRenderedVehiclesAre(thirdBatchOfVehicles)
      })

      it('should not remove vehicles if fetch suddenly returns empty vehicle list', () => {
        const { advanceTimeByMilliseconds } = controlTime()

        simulateFetchReturns(firstBatchOfVehicles)
        mountRealTimeVehicleFeedPage()
        assertRenderedVehiclesAre(firstBatchOfVehicles)

        nextBatchOfVehiclesIs([])
        advanceTimeByMilliseconds(SUCCESS_INTERVAL)
        assertRenderedVehiclesAre(firstBatchOfVehicles)
      })

      // These tests are skipped due to bugs with requestAnimationCallback and faking these
      // Tests pass with WebKit (Chrome, Edge) in `cypress open` but fail in `cypress run` or Firefox
      describe.skip('Failures', () => {
        const isNotificationVisible = () => cy.dataCy('failure-notification').should('be.visible')
        const isNotificationHidden = () => cy.dataCy('failure-notification').should('not.be.visible')
        const assertVehicleFetchInvocationCountIs = (expectedCount: number) => expect(vehicleFetchStub.callCount).to.equal(expectedCount)
        const prepareForFailure = (initialVehicles?: typeof firstBatchOfVehicles) => {
          const timeMethods = controlTime()

          simulateFetchReturns(initialVehicles ?? secondBatchOfVehicles)
          mountRealTimeVehicleFeedPage()
          cy.then(simulateFetchFailed)

          return timeMethods
        }

        inAllLanguages.it('should inform user if there is problems with background fetch', t => {
          const { advanceTimeByMilliseconds, allowAnimationsToRun } = prepareForFailure()

          advanceTimeByMilliseconds(SUCCESS_INTERVAL)
          allowAnimationsToRun()
          isNotificationVisible().should('contain.text', t('failed-to-refresh-vehicles'))
        })

        it('should show notification for 10 seconds', () => {
          const { advanceTimeByMilliseconds, allowAnimationsToRun } = prepareForFailure()

          advanceTimeByMilliseconds(SUCCESS_INTERVAL)
          allowAnimationsToRun()

          for (let i = 0; i < 5; i++) {
            advanceTimeByMilliseconds(2000)
            isNotificationVisible()
          }

          allowAnimationsToRun()
          isNotificationHidden()
        })

        it('should try fetching every 10 seconds until it succeeds', () => {
          const { advanceTimeByMilliseconds } = prepareForFailure(secondBatchOfVehicles)
          advanceTimeByMilliseconds(SUCCESS_INTERVAL)

          let fetchCountAfterFirstException = 0
          cy.then(() => (fetchCountAfterFirstException = vehicleFetchStub.callCount))

          advanceTimeByMilliseconds(FAILURE_INTERVAL - 1)
          cy.then(() => assertVehicleFetchInvocationCountIs(fetchCountAfterFirstException))
          advanceTimeByMilliseconds(1)
          cy.then(() => assertVehicleFetchInvocationCountIs(fetchCountAfterFirstException + 1))

          advanceTimeByMilliseconds(FAILURE_INTERVAL)
          cy.then(() => assertVehicleFetchInvocationCountIs(fetchCountAfterFirstException + 2))

          nextBatchOfVehiclesIs(firstBatchOfVehicles)
          advanceTimeByMilliseconds(FAILURE_INTERVAL)
          assertRenderedVehiclesAre(firstBatchOfVehicles)
        })

        specify('given failures occurred when it goes back to success then it should return to four second interval', () => {
          const { advanceTimeByMilliseconds } = prepareForFailure(firstBatchOfVehicles)
          advanceTimeByMilliseconds(SUCCESS_INTERVAL)

          advanceTimeByMilliseconds(FAILURE_INTERVAL)

          nextBatchOfVehiclesIs(secondBatchOfVehicles)
          advanceTimeByMilliseconds(FAILURE_INTERVAL)
          assertRenderedVehiclesAre(secondBatchOfVehicles)

          nextBatchOfVehiclesIs(thirdBatchOfVehicles)
          advanceTimeByMilliseconds(SUCCESS_INTERVAL)
          assertRenderedVehiclesAre(thirdBatchOfVehicles)
        })
      })
    })
  })
})

function mountRealTimeVehicleFeedPage () {
  cy.mount(RealTimeVehicleFeedPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true,
        BaseMap: true
      }
    }
  })
}

function stubVehicleFetching () {
  vehicleFetchStub = cy.stub(VehicleList, 'fetchAll').resolves()
}

function assertPageHasOnlyOneChild (dataCySelector: string) {
  cy.dataCy('page').should($page => {
    const children = $page.children()
    expect(children).to.have.length(1)
    expect(children[0].getAttribute('data-cy')).to.equal(dataCySelector)
  })
}

function simulateFetchNeverFinished () {
  vehicleFetchStub.callsFake(() => new Promise(() => { /* wait infinitely */ }))
}

function simulateFetchFailed () {
  vehicleFetchStub.rejects()
}

function simulateFetchReturnedEmptyVehicleList () {
  vehicleFetchStub.resolves([])
}

function simulateFetchReturns (vehicles: unknown[]) {
  vehicleFetchStub.resolves(vehicles)
}

function assertRenderedVehiclesAre (expectedVehicles: unknown[]) {
  cy.window({ log: false }).should(() => {
    expect(Cypress.vueWrapper.getComponent(ListOfVehicles).props('vehicles')).to.deep.equal(expectedVehicles)
  })
}
