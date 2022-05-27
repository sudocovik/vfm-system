/// <reference types="google.maps" />
import { ComponentUnderTest } from 'test/support/api'
import { mount } from '@cypress/vue'
import BaseMap, { DEFAULT_CENTER, DEFAULT_ZOOM, GESTURE_HANDLING, POI_VISIBILITY } from '../BaseMap.vue'
import { GoogleMap } from 'vue3-google-map'
import { GoogleMapOptions } from 'src/config/GoogleMapOptions'
import { SinonStub } from 'cypress/types/sinon'
import { h, VNode } from 'vue'

describe('BaseMap', () => {
  let apiKeyStub: SinonStub

  beforeEach(() => {
    apiKeyStub = cy.stub(GoogleMapOptions, 'apiKey').returns('irrelevant-key')
  })

  it('should render GoogleMap component', () => {
    mountMap()

    cy.then(() => {
      const googleMap = getGoogleMap()
      expect(googleMap.exists()).to.equal(true)
    })
  })

  it('should not inherit unspecified properties from GoogleMap component', () => {
    const inheritAttrs = BaseMap.inheritAttrs
    expect(inheritAttrs).to.equal(false)
  })

  describe('should set API key on GoogleMap component', () => {
    const apiKeys = ['first-key', 'second-key']
    apiKeys.forEach((apiKey, i) => {
      it(`case ${i + 1}: api key = '${apiKey}'`, () => {
        apiKeyStub.returns(apiKey)
        mountMap()

        cy.then(() => {
          expect(getGoogleMap().props('apiKey')).to.equal(apiKey)
        })
      })
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
      mapCenterShouldBe(DEFAULT_CENTER)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      centers.forEach((center, i) => {
        it(`case ${i + 1}: center = ${center.lat}, ${center.lng}`, () => {
          mountMap({ center })

          mapCenterShouldBe(center)
        })
      })
    })

    it('should be reactive', () => {
      const firstCenter = centers[0]
      const secondCenter = centers[1]
      mountMap({ center: firstCenter })
      mapCenterShouldBe(firstCenter)

      ComponentUnderTest.changeProperties({ center: secondCenter })
      mapCenterShouldBe(secondCenter)
    })
  })

  describe('(prop): zoom', () => {
    const zooms = [3, 9]

    it('should have a default value', () => {
      mountMap()

      cy.wrap(Cypress.vueWrapper.props('zoom')).should('equal', DEFAULT_ZOOM)
      mapZoomShouldBe(DEFAULT_ZOOM)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      zooms.forEach((zoom, i) => {
        it(`case ${i + 1}: zoom = ${zoom}`, () => {
          mountMap({ zoom })

          mapZoomShouldBe(zoom)
        })
      })
    })

    it('should be reactive', () => {
      const firstZoom = zooms[0]
      const secondZoom = zooms[1]
      mountMap({ zoom: firstZoom })
      mapZoomShouldBe(firstZoom)

      ComponentUnderTest.changeProperties({ zoom: secondZoom })
      mapZoomShouldBe(secondZoom)
    })
  })

  describe('(prop): interactive', () => {
    const possibleInteractivity = [false, true]

    it('should be interactive by default', () => {
      mountMap()

      cy.then(() => expect(Cypress.vueWrapper.props('interactive')).to.equal(true))
      mapInteractivityShouldBe(true)
    })

    describe('should pass it to underlying GoogleMap component', () => {
      possibleInteractivity.forEach((interactive, i) => {
        it(`case ${i + 1}: interactive = ${String(interactive)}`, () => {
          mountMap({ interactive })

          mapInteractivityShouldBe(interactive)
        })
      })
    })

    it('should be reactive', () => {
      const yes = possibleInteractivity[1]
      const no = possibleInteractivity[0]
      mountMap({ interactive: yes })
      mapInteractivityShouldBe(yes)

      ComponentUnderTest.changeProperties({ interactive: no })
      mapInteractivityShouldBe(no)
    })
  })

  describe('(prop): renderPOI', () => {
    const { INVISIBLE, VISIBLE } = POI_VISIBILITY as { INVISIBLE: string, VISIBLE: string }
    const renderPOIStates = [
      { renderPOI: false, expectedVisibility: INVISIBLE },
      { renderPOI: true, expectedVisibility: VISIBLE }
    ]
    const defaultState = renderPOIStates[1]

    it('should be rendered by default', () => {
      mountMap()

      cy.then(() => expect(Cypress.vueWrapper.props('renderPOI')).to.equal(defaultState.renderPOI))
      poiVisibilityShouldBe(defaultState.expectedVisibility)
    })

    describe('should correctly configure \'styles\' property of the GoogleMap component', () => {
      renderPOIStates.forEach(({ renderPOI, expectedVisibility }, i) => {
        it(`case ${i + 1}: renderPOI = ${String(renderPOI)}`, () => {
          mountMap({ renderPOI })

          poiVisibilityShouldBe(expectedVisibility)
        })
      })
    })

    it('should be reactive', () => {
      const firstState = renderPOIStates[0]
      const secondState = renderPOIStates[1]
      mountMap({ renderPOI: firstState.renderPOI })
      poiVisibilityShouldBe(firstState.expectedVisibility)

      ComponentUnderTest.changeProperties({ renderPOI: secondState.renderPOI })
      poiVisibilityShouldBe(secondState.expectedVisibility)
    })
  })

  describe('(attr): class', () => {
    const classes = [
      'test-1 test-2',
      'test-3 test-4'
    ]
    describe('should set class(es) on GoogleMap component', () => {
      classes.forEach((classNames, i) => {
        it(`case ${i + 1}: class = '${classNames}'`, () => {
          mountMapWithAttributes({ class: classNames })

          mapCssClassesShouldBe(classNames)
        })
      })
    })

    it('should be reactive', () => {
      const firstClasses = classes[0]
      const secondClasses = classes[1]
      mountMapWithAttributes({ class: firstClasses })
      mapCssClassesShouldBe(firstClasses)

      ComponentUnderTest.changeProperties({ class: secondClasses })
      mapCssClassesShouldBe(secondClasses)
    })
  })

  describe('(attr): style', () => {
    const styles = [
      'color: red; background-color: white;',
      'color: green; background-color: black;'
    ]
    describe('should set style(s) on GoogleMap component', () => {
      styles.forEach((style, i) => {
        it(`case ${i + 1}: style = '${style}'`, () => {
          mountMapWithAttributes({ style })

          mapStyleShouldBe(style)
        })
      })
    })

    it('should be reactive', () => {
      const firstStyle = styles[0]
      const secondStyle = styles[1]
      mountMapWithAttributes({ style: firstStyle })
      mapStyleShouldBe(firstStyle)

      ComponentUnderTest.changeProperties({ style: secondStyle })
      mapStyleShouldBe(secondStyle)
    })
  })

  describe('(slot): default', () => {
    it('should render HTML content', () => {
      const sampleDivElement = h('div', { innerHTML: 'Test 1' })
      mountMapWithDefaultSlot(sampleDivElement)

      mapHTMLContentShouldBe(() => <string>sampleDivElement.el?.outerHTML)
    })

    it('should render text content', () => {
      const sampleTextContent = 'My custom text'
      mountMapWithDefaultSlot(sampleTextContent)

      mapHTMLContentShouldBe(sampleTextContent)
    })
  })
})

function mountMap (props?: Record<string, unknown>) {
  mount(BaseMap, {
    global: {
      stubs: {
        GoogleMap: {
          props: ['center', 'zoom', 'disableDefaultUi', 'gestureHandling', 'styles', 'apiKey']
        }
      }
    },
    props
  })
}

function mountMapWithAttributes (attrs?: Record<string, unknown>) {
  mount(BaseMap, {
    global: {
      stubs: {
        GoogleMap: true
      }
    },
    attrs
  })
}

function mountMapWithDefaultSlot (slotContent: string | VNode) {
  mount(BaseMap, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        GoogleMap: true
      }
    },
    slots: {
      default: {
        render: () => slotContent
      }
    }
  })
}

function getGoogleMap () {
  return Cypress.vueWrapper.findComponent(GoogleMap)
}

function mapCenterShouldBe (center: google.maps.LatLngLiteral) {
  cy.then(getGoogleMap)
    .then((googleMap) => expect(googleMap.props('center')).to.deep.equal(center))
}

function mapZoomShouldBe (zoom: number) {
  cy.then(getGoogleMap)
    .then((googleMap) => expect(googleMap.props('zoom')).to.equal(zoom))
}

function mapInteractivityShouldBe (interactive: boolean) {
  // Why ESLint thinks this is 'any' type is a great mystery
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { ENABLED, DISABLED } = GESTURE_HANDLING

  cy.then(getGoogleMap)
    .then((googleMap) => {
      expect(googleMap.props('disableDefaultUi')).to.equal(!interactive)
      expect(googleMap.props('gestureHandling')).to.equal(interactive ? ENABLED : DISABLED)
    })
}

function getPoiStyles () {
  const allStyles = <google.maps.MapTypeStyle[]>(getGoogleMap().props('styles'))
  const poiStyling = allStyles.find(({ featureType }) => featureType === 'poi')
  const poiVisibility = (poiStyling?.stylers[0] as { visibility: string }).visibility

  return { poiStyling, poiVisibility }
}

function getTransitStyles () {
  const allStyles = <google.maps.MapTypeStyle[]>(getGoogleMap().props('styles'))
  const transitStyling = allStyles.find(({ featureType }) => featureType === 'transit')
  const transitVisibility = (transitStyling?.stylers[0] as { visibility: string }).visibility

  return { transitStyling, transitVisibility }
}

function poiVisibilityShouldBe (visibility: string) {
  cy.then(() => {
    const { poiStyling, poiVisibility } = getPoiStyles()

    expect(poiStyling).to.have.property('elementType', 'labels')
    expect(poiVisibility).to.equal(visibility)
  })

  cy.then(() => {
    const { transitStyling, transitVisibility } = getTransitStyles()

    expect(transitStyling).to.have.property('elementType', 'all')
    expect(transitVisibility).to.equal(visibility)
  })
}

function mapCssClassesShouldBe (classNames: string) {
  cy.then(getGoogleMap)
    .then((googleMap) => {
      const mapClasses = googleMap.attributes('class')
      expect(mapClasses).to.equal(classNames)
    })
}

function mapStyleShouldBe (style: string) {
  cy.then(getGoogleMap)
    .then((googleMap) => {
      const mapStyle = googleMap.attributes('style')
      expect(mapStyle).to.equal(style)
    })
}

function mapHTMLContentShouldBe (sampleTextContent: string | (() => string)) {
  cy.then(getGoogleMap)
    .then((googleMap) => {
      const wantedContent = typeof sampleTextContent === 'function' ? sampleTextContent() : sampleTextContent
      expect(googleMap.element.innerHTML).to.equal(wantedContent)
    })
}
