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
    it('should have a default value', () => {
      mountMap()

      cy.wrap(Cypress.vueWrapper.props('center')).should('deep.equal', DEFAULT_CENTER)
      cy.wrap(Cypress.vueWrapper.findComponent(GoogleMap).props('center')).should('deep.equal', DEFAULT_CENTER)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      const centers = [
        { lat: 22.341, lng: 46.675 },
        { lat: 35.463, lng: 45.875 }
      ]
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
  })

  describe('(prop): zoom', () => {
    it('should have a default value', () => {
      mountMap()

      cy.wrap(Cypress.vueWrapper.props('zoom')).should('equal', DEFAULT_ZOOM)
      cy.wrap(Cypress.vueWrapper.findComponent(GoogleMap).props('zoom')).should('equal', DEFAULT_ZOOM)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      const zooms = [3, 9]
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
  })
})

function mountMap (props?: Record<string, unknown>) {
  mount(BaseMap, {
    global: {
      stubs: {
        GoogleMap: {
          props: ['center', 'zoom']
        }
      }
    },
    props
  })
}
