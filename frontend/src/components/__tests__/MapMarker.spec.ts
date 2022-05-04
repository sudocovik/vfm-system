import { mount } from '@cypress/vue'
import MapMarker from '../MapMarker.vue'
import { Marker as GoogleMapMarker } from 'vue3-google-map'
import { ComponentUnderTest } from 'test/support/ComponentUnderTest'
import { SVG } from '../Map/Icon'

describe('MapMarker', () => {
  it('should render GoogleMapMarker', () => {
    mountMarker()

    cy.then(getGoogleMapMarker)
      .then(marker => expect(marker.exists()).to.equal(true))
  })

  it('should not inherit unspecified properties from GoogleMap component', () => {
    const inheritAttrs = MapMarker.inheritAttrs
    expect(inheritAttrs).to.equal(false)
  })

  it('should not be clickable by default', () => {
    mountMarker()

    cy.then(getGoogleMapMarker)
      .then(marker => <google.maps.MarkerOptions>marker.props('options'))
      .then(options => expect(options.clickable).to.equal(false))
  })

  describe('(prop): latitude', () => {
    const latitudes = [45.1965, 43.1583]

    describe('should pass it to underlying GoogleMapMarker component', () => {
      latitudes.forEach((expectedLatitude, i) => {
        it(`case ${i + 1}: latitude = ${expectedLatitude}`, () => {
          mountMarker({ latitude: expectedLatitude })

          markerLatitudeShouldBe(expectedLatitude)
        })
      })
    })

    it('should be reactive', () => {
      const firstLatitude = latitudes[0]
      const secondLatitude = latitudes[1]

      mountMarker({ latitude: firstLatitude })
      markerLatitudeShouldBe(firstLatitude)

      ComponentUnderTest.changeProperties({ latitude: secondLatitude })
      markerLatitudeShouldBe(secondLatitude)
    })
  })

  describe('(prop): longitude', () => {
    const longitudes = [15.1965, 15.2451]

    describe('should pass it to underlying GoogleMapMarker component', () => {
      longitudes.forEach((expectedLongitude, i) => {
        it(`case ${i + 1}: longitude = ${expectedLongitude}`, () => {
          mountMarker({ longitude: expectedLongitude })

          markerLongitudeShouldBe(expectedLongitude)
        })
      })
    })

    it('should be reactive', () => {
      const firstLongitude = longitudes[0]
      const secondLongitude = longitudes[1]

      mountMarker({ longitude: firstLongitude })
      markerLongitudeShouldBe(firstLongitude)

      ComponentUnderTest.changeProperties({ longitude: secondLongitude })
      markerLongitudeShouldBe(secondLongitude)
    })
  })

  describe('(prop): icon', () => {
    const svgTemplates = ['first-svg-template', 'second-svg-template']

    it('should be undefined by default', () => {
      mountMarker()

      markerIconShouldNotExist()
    })

    describe('should pass URL to underlying GoogleMapMarker component', () => {
      svgTemplates.forEach((template, i) => {
        it(`case ${i + 1}: template = '${template}'`, () => {
          const icon = new SVG(template)
          const url = icon.toUrl()

          mountMarker({ icon })

          markerIconUrlShouldBe(url)
        })
      })
    })

    it('should be reactive when changing to different icon', () => {
      const firstIcon = new SVG(svgTemplates[0])
      const secondIcon = new SVG(svgTemplates[1])
      mountMarker({ icon: firstIcon })
      markerIconUrlShouldBe(firstIcon.toUrl())

      ComponentUnderTest.changeProperties({ icon: secondIcon })
      markerIconUrlShouldBe(secondIcon.toUrl())
    })

    it('should remove icon object when prop is set to undefined but previously was SVG icon', () => {
      const svgIcon = new SVG(svgTemplates[0])
      mountMarker({ icon: svgIcon })
      markerIconUrlShouldBe(svgIcon.toUrl())

      ComponentUnderTest.changeProperties({ icon: undefined })
      markerIconShouldNotExist()
    })
  })
})

function getGoogleMapMarker () {
  return Cypress.vueWrapper.findComponent(GoogleMapMarker)
}

function mountMarker (props?: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mount(MapMarker, {
    global: {
      stubs: {
        GoogleMapMarker: {
          props: ['options']
        }
      }
    },
    props
  })
}

function markerLatitudeShouldBe (expectedLatitude: number) {
  cy.then(getGoogleMapMarker)
    .then(marker => {
      const markerOptions = <google.maps.MarkerOptions>marker.props('options')
      const { position } = markerOptions
      const { lat } = <google.maps.LatLngLiteral>position

      expect(lat).to.equal(expectedLatitude)
    })
}

function markerLongitudeShouldBe (expectedLongitude: number) {
  cy.then(getGoogleMapMarker)
    .then(marker => {
      const markerOptions = <google.maps.MarkerOptions>marker.props('options')
      const { position } = markerOptions
      const { lng } = <google.maps.LatLngLiteral>position

      expect(lng).to.equal(expectedLongitude)
    })
}

function markerIconShouldNotExist () {
  cy.then(getGoogleMapMarker)
    .then(marker => <google.maps.MarkerOptions>marker.props('options'))
    .then(options => expect(options).not.to.haveOwnProperty('icon'))
}

function markerIconUrlShouldBe (expectedURL: string) {
  cy.then(getGoogleMapMarker)
    .then(marker => <google.maps.MarkerOptions>marker.props('options'))
    .then(options => <google.maps.Icon>options.icon)
    .then(icon => expect(icon.url).to.equal(expectedURL))
}
