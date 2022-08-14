import MapMarker from '../MapMarker.vue'
import { Marker as GoogleMapMarker } from 'vue3-google-map'
import { ComponentUnderTest } from 'test/support/ComponentUnderTest'
import { SVG } from '../Icon'
import { VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import { ComponentProps } from 'test/support/api'

type GoogleMapMarkerComponent = VueWrapper<InstanceType<typeof GoogleMapMarker>>
type MapMarkerProps = ComponentProps<typeof MapMarker>

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
      .then(getMarkerOptions)
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

  describe('(prop): iconCenter', () => {
    it('should be false by default', () => {
      mountMarker()

      cy.then(() => {
        expect(Cypress.vueWrapper.props('iconCenter')).to.equal(false)
      })
    })

    it('should not set icon anchor when icon is missing and iconCenter is false', () => {
      mountMarker({ icon: undefined, iconCenter: false })

      cy.then(getGoogleMapMarker)
        .then(getMarkerOptions)
        .then(options => cy.wrap(options.icon?.anchor))
        .should('be.undefined')
    })

    it('should not set icon anchor when icon is given but iconCenter is false', () => {
      mountMarker({ icon: new SVG('irrelevant'), iconCenter: false })

      cy.then(getGoogleMapMarker)
        .then(getMarkerOptions)
        .then(options => cy.wrap(options.icon?.anchor))
        .should('be.undefined')
    })

    it('should set icon anchor when icon is given and iconCenter is true', () => {
      const icon = new SVG('irrelevant')
        .havingWidth(32)
        .havingHeight(24)

      const expectedAnchorX = 16
      const expectedAnchorY = 12

      mountMarker({ icon, iconCenter: true })

      markerIconAnchorShouldBe(expectedAnchorX, expectedAnchorY)
    })

    it('should update icon anchor when icon width and height changes', () => {
      const initialIcon = reactive(
        new SVG('irrelevant')
          .havingWidth(32)
          .havingHeight(32)
      )

      mountMarker({ icon: initialIcon, iconCenter: true })
      markerIconAnchorShouldBe(16, 16)

      cy.then(() => {
        const iconWithDifferentWidthAndHeight = initialIcon
          .havingWidth(48)
          .havingHeight(24)

        ComponentUnderTest.changeProperties({ icon: iconWithDifferentWidthAndHeight })
        markerIconAnchorShouldBe(24, 12)
      })
    })
  })
})

function getGoogleMapMarker () {
  return Cypress.vueWrapper.findComponent(GoogleMapMarker) as unknown as GoogleMapMarkerComponent
}

function getMarkerOptions (marker: GoogleMapMarkerComponent) {
  return <google.maps.MarkerOptions>marker.props('options')
}

function getMarkerPosition (options: google.maps.MarkerOptions) {
  return <google.maps.LatLngLiteral>options.position
}

function mountMarker (props?: MapMarkerProps) {
  const defaultProps = {
    latitude: 0,
    longitude: 0
  }
  const allProps = { ...defaultProps, ...props }

  cy.mount(MapMarker, {
    global: {
      stubs: {
        GoogleMapMarker: true
      }
    },
    props: allProps
  })
}

function markerLatitudeShouldBe (expectedLatitude: number) {
  cy.then(getGoogleMapMarker)
    .then(getMarkerOptions)
    .then(getMarkerPosition)
    .then(position => cy.wrap(position.lat))
    .should('equal', expectedLatitude)
}

function markerLongitudeShouldBe (expectedLongitude: number) {
  cy.then(getGoogleMapMarker)
    .then(getMarkerOptions)
    .then(getMarkerPosition)
    .then(position => cy.wrap(position.lng))
    .should('equal', expectedLongitude)
}

function markerIconShouldNotExist () {
  cy.then(getGoogleMapMarker)
    .then(getMarkerOptions)
    .then(options => expect(options).not.to.haveOwnProperty('icon'))
}

function markerIconUrlShouldBe (expectedURL: string) {
  cy.then(getGoogleMapMarker)
    .then(getMarkerOptions)
    .then(options => <google.maps.Icon>options.icon)
    .then(icon => expect(icon.url).to.equal(expectedURL))
}

function markerIconAnchorShouldBe (expectedX: number, expectedY: number) {
  const expectedAnchor = {
    x: expectedX,
    y: expectedY
  }

  cy.then(getGoogleMapMarker)
    .then(getMarkerOptions)
    .then(options => cy.wrap(options.icon?.anchor))
    .should('deep.equal', expectedAnchor)
}
