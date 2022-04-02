/// <reference types="google.maps" />
import { mount } from '@cypress/vue'
import BaseMap, { DEFAULT_CENTER, DEFAULT_ZOOM } from '../BaseMap.vue'
import { GoogleMap } from 'vue3-google-map'

describe('BaseMap', () => {
  it('should render GoogleMap component', () => {
    mountMap()

    cy.then(() => {
      const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
      expect(googleMap.exists()).to.equal(true)
    })
  })

  it('should not inherit unspecified properties from GoogleMap component', () => {
    mountMap()

    cy.then(() => {
      const inheritAttrs = BaseMap.inheritAttrs
      expect(inheritAttrs).to.equal(false)
    })
  })

  describe('(prop): center', () => {
    const centers = [
      { lat: 22.341, lng: 46.675 },
      { lat: 35.463, lng: 45.875 }
    ]

    it('should have a default value', () => {
      mountMap()

      cy.wrap(Cypress.vueWrapper.props('center')).should('deep.equal', DEFAULT_CENTER)
      cy.wrap(Cypress.vueWrapper.findComponent(GoogleMap).props('center')).should('deep.equal', DEFAULT_CENTER)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      centers.forEach((center, i) => {
        it(`case ${i + 1}: coordinates ${center.lat}, ${center.lng}`, () => {
          mountMap({ center })

          cy.then(() => {
            const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
            expect(googleMap.props('center')).to.deep.equal(center)
          })
        })
      })
    })

    it('should be reactive', () => {
      const firstCenter = centers[0]
      const secondCenter = centers[1]
      mountMap({ center: firstCenter })

      cy.then(() => {
        const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
        expect(googleMap.props('center')).to.deep.equal(firstCenter)
      })

      cy.then(() => Cypress.vueWrapper.setProps({ center: secondCenter }))

      cy.then(() => {
        const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
        expect(googleMap.props('center')).to.deep.equal(secondCenter)
      })
    })
  })

  describe('(prop): zoom', () => {
    const zooms = [3, 9]

    it('should have a default value', () => {
      mountMap()

      cy.wrap(Cypress.vueWrapper.props('zoom')).should('equal', DEFAULT_ZOOM)
      cy.wrap(Cypress.vueWrapper.findComponent(GoogleMap).props('zoom')).should('equal', DEFAULT_ZOOM)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      zooms.forEach((zoom, i) => {
        it(`case ${i + 1}: level ${zoom}`, () => {
          mountMap({ zoom })

          cy.then(() => {
            const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
            expect(googleMap.props('zoom')).to.equal(zoom)
          })
        })
      })
    })

    it('should be reactive', () => {
      const firstZoom = zooms[0]
      const secondZoom = zooms[1]
      mountMap({ zoom: firstZoom })

      cy.then(() => {
        const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
        expect(googleMap.props('zoom')).to.deep.equal(firstZoom)
      })

      cy.then(() => Cypress.vueWrapper.setProps({ zoom: secondZoom }))

      cy.then(() => {
        const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
        expect(googleMap.props('zoom')).to.deep.equal(secondZoom)
      })
    })
  })

  describe('(prop): interactive', () => {
    it('should be interactive by default', () => {
      mountMap()

      cy.then(() => {
        expect(Cypress.vueWrapper.props('interactive')).to.equal(true)
        const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
        expect(googleMap.props('disableDefaultUi')).to.equal(false)
        expect(googleMap.props('gestureHandling')).to.equal('auto')
      })
    })

    describe('should pass it to underlying GoogleMap component', () => {
      const possibleInteractivity = [false, true]
      possibleInteractivity.forEach((interactive, i) => {
        it(`case ${i + 1}: ${interactive ? '' : 'non-'}interactive`, () => {
          mountMap({ interactive })

          cy.then(() => {
            expect(Cypress.vueWrapper.props('interactive')).to.equal(interactive)
            const googleMap = Cypress.vueWrapper.findComponent(GoogleMap)
            expect(googleMap.props('disableDefaultUi')).to.equal(!interactive)
            expect(googleMap.props('gestureHandling')).to.equal(interactive ? 'auto' : 'none')
          })
        })
      })
    })
  })

  describe('(prop): renderPOI', () => {
    const renderPOIStates = [
      { renderPOI: false, expectedVisibility: 'off' },
      { renderPOI: true, expectedVisibility: 'on' }
    ]
    const defaultState = renderPOIStates[1]

    it('should be rendered by default', () => {
      mountMap()

      cy.then(() => expect(Cypress.vueWrapper.props('renderPOI')).to.equal(defaultState.renderPOI))
      cy.then(poiVisibilityShouldBe(defaultState.expectedVisibility))
    })

    describe('should correctly configure \'styles\' property of the GoogleMap component', () => {
      renderPOIStates.forEach(({ renderPOI, expectedVisibility }, i) => {
        it(`case ${i + 1}: do${renderPOI ? '' : ' not'} render POIs`, () => {
          mountMap({ renderPOI })

          cy.then(() => expect(Cypress.vueWrapper.props('renderPOI')).to.equal(renderPOI))
          cy.then(poiVisibilityShouldBe(expectedVisibility))
        })
      })
    })
  })
})

function mountMap (props?: Record<string, unknown>) {
  mount(BaseMap, {
    global: {
      stubs: {
        GoogleMap: {
          props: ['center', 'zoom', 'disableDefaultUi', 'gestureHandling', 'styles']
        }
      }
    },
    props
  })
}

function getPoiStyles () {
  const allStyles = <google.maps.MapTypeStyle[]>(Cypress.vueWrapper.findComponent(GoogleMap).props('styles'))
  const poiStyling = allStyles.find(({ featureType }) => featureType === 'poi')
  const poiVisibility = (poiStyling?.stylers[0] as { visibility: 'on' | 'off' }).visibility

  return { poiStyling, poiVisibility }
}

function poiVisibilityShouldBe (visibility: string) {
  return () => {
    const { poiStyling, poiVisibility } = getPoiStyles()

    expect(poiStyling).to.have.property('elementType', 'labels')
    expect(poiVisibility).to.equal(visibility)
  }
}
