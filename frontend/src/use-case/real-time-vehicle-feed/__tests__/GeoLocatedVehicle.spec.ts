import { mount } from '@cypress/vue'
import GeoLocatedVehicle, { MAP_HEIGHT } from '../GeoLocatedVehicle.vue'
import { BaseMap, icon as MarkerIcon, MapMarker } from 'components/Map'
import { ComponentUnderTest } from 'test/support/api'
import { VueWrapper } from '@vue/test-utils'
import { colors as StatusColors, createIcon as VehicleMapIcon } from '../VehicleMapIcon'

describe('GeoLocatedVehicle', () => {
  describe('(prop): latitude', () => {
    const latitudes = [45.1234, 46.4321]

    describe('should pass it to BaseMap.center.lat and MapMarker.latitude', () => {
      latitudes.forEach((latitude, i) => {
        it(`case ${i + 1}: latitude = ${latitude}`, () => {
          mountGeoLocatedVehicle({ latitude })

          baseMapCenterLatitudeShouldBe(latitude)
          mapMarkerLatitudeShouldBe(latitude)
        })
      })
    })

    it('should be reactive', () => {
      const firstLatitude = latitudes[0]
      const secondLatitude = latitudes[1]

      mountGeoLocatedVehicle({ latitude: firstLatitude })
      baseMapCenterLatitudeShouldBe(firstLatitude)
      mapMarkerLatitudeShouldBe(firstLatitude)

      ComponentUnderTest.changeProperties({ latitude: secondLatitude })
      baseMapCenterLatitudeShouldBe(secondLatitude)
      mapMarkerLatitudeShouldBe(secondLatitude)
    })
  })

  describe('(prop): longitude', () => {
    const longitudes = [15.1234, 16.4321]

    describe('should pass it to BaseMap.center.lng and MapMarker.longitude', () => {
      longitudes.forEach((longitude, i) => {
        it(`case ${i + 1}: longitude = ${longitude}`, () => {
          mountGeoLocatedVehicle({ longitude })

          baseMapCenterLongitudeShouldBe(longitude)
          mapMarkerLongitudeShouldBe(longitude)
        })
      })
    })

    it('should be reactive', () => {
      const firstLongitude = longitudes[0]
      const secondLongitude = longitudes[1]

      mountGeoLocatedVehicle({ longitude: firstLongitude })
      baseMapCenterLongitudeShouldBe(firstLongitude)
      mapMarkerLongitudeShouldBe(firstLongitude)

      ComponentUnderTest.changeProperties({ longitude: secondLongitude })
      baseMapCenterLongitudeShouldBe(secondLongitude)
      mapMarkerLongitudeShouldBe(secondLongitude)
    })
  })

  describe('(prop): licensePlate', () => {
    const licensePlates = ['ZD000AA', 'ZD111AA']
    const licensePlateShouldBe = (licensePlate: string) => cy.dataCy('license-plate').should('have.text', licensePlate)

    licensePlates.forEach(licensePlate => {
      it(`should render license plate '${licensePlate}'`, () => {
        mountGeoLocatedVehicle({ licensePlate })

        licensePlateShouldBe(licensePlate)
      })
    })

    it('should be reactive', () => {
      const firstLicensePlate = licensePlates[0]
      const secondLicensePlate = licensePlates[1]
      mountGeoLocatedVehicle({ licensePlate: firstLicensePlate })
      licensePlateShouldBe(firstLicensePlate)

      ComponentUnderTest.changeProperties({ licensePlate: secondLicensePlate })
      licensePlateShouldBe(secondLicensePlate)
    })
  })

  describe('(prop): moving', () => {
    const movementStates = [
      { moving: false, icon: 'mdi-truck' },
      { moving: true, icon: 'mdi-truck-fast' }
    ]
    const vehicleIconShouldBe = (icon: string) => cy.dataCy('icon').invoke('hasClass', icon).should('equal', true)

    movementStates.forEach(({ moving, icon }) => {
      it(`should render '${icon}' icon when ${moving ? 'moving' : 'not moving'}`, () => {
        mountGeoLocatedVehicle({ moving })

        vehicleIconShouldBe(icon)
      })
    })

    it('should be reactive', () => {
      const firstState = movementStates[0]
      const secondState = movementStates[1]
      mountGeoLocatedVehicle({ moving: firstState.moving })
      vehicleIconShouldBe(firstState.icon)

      ComponentUnderTest.changeProperties({ moving: secondState.moving })
      vehicleIconShouldBe(secondState.icon)
    })
  })

  describe('(prop): address', () => {
    const addresses = ['Ulica Ante Starčevića 1a, 23000 Zadar, HR', 'Splitska ulica 11, 23000 Zadar, HR']
    const addressShouldBe = (address: string) => cy.dataCy('address').should('have.text', address)

    addresses.forEach(address => {
      it(`should render address '${address}'`, () => {
        mountGeoLocatedVehicle({ address })

        addressShouldBe(address)
      })
    })

    it('should be reactive', () => {
      const firstAddress = addresses[0]
      const secondAddress = addresses[1]
      mountGeoLocatedVehicle({ address: firstAddress })
      addressShouldBe(firstAddress)

      ComponentUnderTest.changeProperties({ address: secondAddress })
      addressShouldBe(secondAddress)
    })
  })

  describe('(prop): ignition', () => {
    it('should be false by default', () => {
      mountGeoLocatedVehicle()

      cy.then(() => Cypress.vueWrapper.props('ignition') as boolean)
        .then(ignition => expect(ignition).to.equal(false))
    })
  })

  describe('(prop): course', () => {
    it('should be 0 by default', () => {
      mountGeoLocatedVehicle()

      cy.then(() => Cypress.vueWrapper.props('course') as number)
        .then(course => expect(course).to.equal(0))
    })
  })

  it('should render speed', () => {
    mountGeoLocatedVehicle()

    cy.dataCy('speed').should('have.text', '30 km/h')
  })

  describe('(component): BaseMap', () => {
    it('should render', () => {
      mountGeoLocatedVehicle()

      cy.then(() => {
        const baseMap = getBaseMap()
        expect(baseMap.exists()).to.equal(true)
      })
    })

    it(`should be ${String(MAP_HEIGHT)}px high`, () => {
      mountGeoLocatedVehicle()

      mapHeightShouldBe(MAP_HEIGHT)
    })

    it('should be 100% wide', () => {
      mountGeoLocatedVehicle()

      mapWidthShouldBe('100%')
    })

    it('should respect q-card\'s border radius', () => {
      mountGeoLocatedVehicle()

      mapOverflowShouldBe('hidden')
    })

    it('should not be interactive', () => {
      mountGeoLocatedVehicle()

      mapInteractivityShouldBe(false)
    })
  })

  describe('(component): MapMarker', () => {
    it('should be a direct child of BaseMap', () => {
      mountGeoLocatedVehicle()

      cy.then(getBaseMap)
        .then(getMapMarker)
        .then(marker => cy.wrap(marker.exists()))
        .should('equal', true)
    })
  })

  describe('Title', () => {
    it('should consist of icon and license plate', () => {
      mountGeoLocatedVehicle()

      cy.get('[data-cy="title"] > [data-cy="icon"]')
      cy.get('[data-cy="title"] > [data-cy="license-plate"]')
    })

    it('should be yellow when prop \'ignition\' is false but green when it\'s true', () => {
      mountGeoLocatedVehicle({ ignition: false })
      cy.dataCy('title').should('have.css', 'color').and('be.colored', StatusColors.yellow.fill)

      ComponentUnderTest.changeProperties({ ignition: true })
      cy.dataCy('title').should('have.css', 'color').and('be.colored', StatusColors.green.fill)
    })
  })

  describe('Map icon', () => {
    it('should be an SVG icon', () => {
      mountGeoLocatedVehicle()

      cy.then(getBaseMap)
        .then(getMapMarker)
        .then(marker => marker.props('icon') as unknown)
        .then(icon => expect(icon).to.be.instanceof(MarkerIcon.SVG))
    })

    it('should be 32 pixels wide', () => {
      mountGeoLocatedVehicle()

      cy.then(getBaseMap)
        .then(getMapMarker)
        .then(marker => marker.props('icon') as MarkerIcon.SVG)
        .then(icon => expect(icon.width()).to.equal(32))
    })

    it('should be 32 pixels high', () => {
      mountGeoLocatedVehicle()

      cy.then(getBaseMap)
        .then(getMapMarker)
        .then(marker => marker.props('icon') as MarkerIcon.SVG)
        .then(icon => expect(icon.height()).to.equal(32))
    })

    it('should be centered', () => {
      mountGeoLocatedVehicle()

      cy.then(getBaseMap)
        .then(getMapMarker)
        .then(marker => cy.wrap(marker.props('iconCenter')))
        .should('equal', true)
    })

    it('should render stop indicator when prop \'moving\' is false', () => {
      const movingStatus = false
      const stopIndicator = new MarkerIcon.SVG(VehicleMapIcon(movingStatus))
      mountGeoLocatedVehicle({ moving: movingStatus })

      markerIconShouldBe(stopIndicator)
    })

    it('should render direction arrow when prop \'moving\' is true', () => {
      const movingStatus = true
      const directionArrow = new MarkerIcon.SVG(VehicleMapIcon(movingStatus))
      mountGeoLocatedVehicle({ moving: movingStatus })

      markerIconShouldBe(directionArrow)
    })

    it('should render icon in orange color when prop \'ignition\' is false', () => {
      const ignitionStatus = false
      const orangeIcon = new MarkerIcon.SVG(VehicleMapIcon(false, ignitionStatus))
      mountGeoLocatedVehicle({ ignition: ignitionStatus })

      markerIconShouldBe(orangeIcon)
    })

    it('should render icon in green color when prop \'ignition\' is true', () => {
      const ignitionStatus = true
      const greenIcon = new MarkerIcon.SVG(VehicleMapIcon(false, ignitionStatus))
      mountGeoLocatedVehicle({ ignition: ignitionStatus })

      markerIconShouldBe(greenIcon)
    })

    it('should render icon facing east when prop \'course\' is 90 degrees', () => {
      const east = 90
      const facingEast = new MarkerIcon.SVG(VehicleMapIcon(true, true, east))
      mountGeoLocatedVehicle({ moving: true, ignition: true, course: east })

      markerIconShouldBe(facingEast)
    })

    it('should render icon facing west when prop \'course\' is 270 degrees', () => {
      const west = 270
      const facingWest = new MarkerIcon.SVG(VehicleMapIcon(true, true, west))
      mountGeoLocatedVehicle({ moving: true, ignition: true, course: west })

      markerIconShouldBe(facingWest)
    })

    it('should be reactive', () => {
      const stationary = false, hasIgnition = true, north = 0
      const greenStopIndicatorFacingNorth = new MarkerIcon.SVG(VehicleMapIcon(stationary, hasIgnition, north))
      mountGeoLocatedVehicle({
        moving: stationary,
        ignition: hasIgnition,
        course: north
      })
      markerIconShouldBe(greenStopIndicatorFacingNorth)

      const moving = true, noIgnition = false, west = 270
      const yellowDirectionArrowFacingWest = new MarkerIcon.SVG(VehicleMapIcon(moving, noIgnition, west))
      ComponentUnderTest.changeProperties({
        moving,
        ignition: noIgnition,
        course: west
      })
      markerIconShouldBe(yellowDirectionArrowFacingWest)
    })
  })
})

function mountGeoLocatedVehicle (props?: Record<string, unknown>) {
  // For some reason, after adding 'licensePlate' as required property, TS complains 'props' object does not exist...
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mount(GeoLocatedVehicle, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        BaseMap: true,
        MapMarker: true
      }
    },
    props
  })
}

function getBaseMap () {
  return Cypress.vueWrapper.findComponent(BaseMap)
}

function getMapMarker (baseMap: VueWrapper) {
  return baseMap.findComponent(MapMarker)
}

function baseMapCenterLatitudeShouldBe (expectedLatitude: number) {
  cy.then(getBaseMap)
    .then(map => (<google.maps.LatLngLiteral>map.props('center')).lat)
    .then(latitude => cy.wrap(latitude))
    .should('equal', expectedLatitude)
}

function mapMarkerLatitudeShouldBe (expectedLatitude: number) {
  cy.then(getBaseMap)
    .then(getMapMarker)
    .then(marker => marker.props('latitude') as number)
    .then(latitude => cy.wrap(latitude))
    .should('equal', expectedLatitude)
}

function baseMapCenterLongitudeShouldBe (expectedLongitude: number) {
  cy.then(getBaseMap)
    .then(map => (<google.maps.LatLngLiteral>map.props('center')).lng)
    .then(longitude => cy.wrap(longitude))
    .should('equal', expectedLongitude)
}

function mapMarkerLongitudeShouldBe (expectedLongitude: number) {
  cy.then(getBaseMap)
    .then(getMapMarker)
    .then(marker => marker.props('longitude') as number)
    .then(longitude => cy.wrap(longitude))
    .should('equal', expectedLongitude)
}

function mapWidthShouldBe (expectedWidth: string) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('css', 'width')
    .should('equal', expectedWidth)
}

function mapHeightShouldBe (expectedHeight: number) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('outerHeight')
    .should('equal', expectedHeight)
}

function mapOverflowShouldBe (expectedOverflow: string) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.element))
    .invoke('css', 'overflow')
    .should('equal', expectedOverflow)
}

function mapInteractivityShouldBe (expectedInteractivity: boolean) {
  cy.then(getBaseMap)
    .then(baseMap => cy.wrap(baseMap.props('interactive')))
    .should('equal', expectedInteractivity)
}

function markerIconShouldBe (expectedIcon: MarkerIcon.SVG) {
  cy.then(getBaseMap)
    .then(getMapMarker)
    .then(marker => marker.props('icon') as MarkerIcon.SVG)
    .then(icon => expect(icon.toUrl()).to.equal(expectedIcon.toUrl()))
}
