import { mount } from '@cypress/vue'
import ListOfVehicles from '../ListOfVehicles.vue'
import GeoLocatedVehicle from '../GeoLocatedVehicle.vue'
import { firstGeoLocatedVehicle } from '../__fixtures__/geo-located-vehicles'

describe('ListOfVehicles', () => {
  specify('given list of non-vehicles it should render nothing', () => {
    const gibberish = [false, null, undefined, 'lol', -1]

    mountListOfVehicles({ vehicles: gibberish })

    cy.dataCy('root-node').should('not.have.html')
  })

  specify('given list of single vehicle it should render it', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(() => Cypress.vueWrapper.findComponent(GeoLocatedVehicle))
      .then(geoLocatedVehicle => {
        expect(geoLocatedVehicle.props('licensePlate')).to.equal(firstGeoLocatedVehicle.licensePlate())
        expect(geoLocatedVehicle.props('latitude')).to.equal(firstGeoLocatedVehicle.latitude())
        expect(geoLocatedVehicle.props('longitude')).to.equal(firstGeoLocatedVehicle.longitude())
        expect(geoLocatedVehicle.props('address')).to.equal(firstGeoLocatedVehicle.address())
        expect(geoLocatedVehicle.props('speed')).to.deep.equal(firstGeoLocatedVehicle.speed())
        expect(geoLocatedVehicle.props('ignition')).to.equal(firstGeoLocatedVehicle.ignition())
        expect(geoLocatedVehicle.props('moving')).to.equal(firstGeoLocatedVehicle.moving())
        expect(geoLocatedVehicle.props('course')).to.equal(firstGeoLocatedVehicle.course())
      })
  })
})

function mountListOfVehicles (props: Record<string, unknown>) {
  const defaultProps = { vehicles: [] }
  const allProps = { ...defaultProps, ...props }

  mount(ListOfVehicles, {
    props: allProps,
    global: {
      stubs: {
        GeoLocatedVehicle: true
      }
    }
  })
}
