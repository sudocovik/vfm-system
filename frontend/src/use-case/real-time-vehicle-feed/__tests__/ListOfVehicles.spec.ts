import { mount } from '@cypress/vue'
import ListOfVehicles from '../ListOfVehicles.vue'
import GeoLocatedVehicle from '../GeoLocatedVehicle.vue'
import { firstGeoLocatedVehicle, secondGeoLocatedVehicle } from '../__fixtures__/geo-located-vehicles'
import { VueWrapper } from '@vue/test-utils'
import { GeoLocatedVehicle as Vehicle } from 'src/backend/VehicleService'

function assertGeoLocatedVehicleProps (vehicleComponent: VueWrapper<InstanceType<typeof GeoLocatedVehicle>>, expectedVehicle: Vehicle) {
  expect((vehicleComponent.vm as unknown as { $: { vnode: { key: number }}}).$.vnode.key).to.equal(expectedVehicle.id())
  expect(vehicleComponent.props('licensePlate')).to.equal(expectedVehicle.licensePlate())
  expect(vehicleComponent.props('latitude')).to.equal(expectedVehicle.latitude())
  expect(vehicleComponent.props('longitude')).to.equal(expectedVehicle.longitude())
  expect(vehicleComponent.props('address')).to.equal(expectedVehicle.address())
  expect(vehicleComponent.props('speed')).to.deep.equal(expectedVehicle.speed())
  expect(vehicleComponent.props('ignition')).to.equal(expectedVehicle.ignition())
  expect(vehicleComponent.props('moving')).to.equal(expectedVehicle.moving())
  expect(vehicleComponent.props('course')).to.equal(expectedVehicle.course())
}

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
      .then(component => assertGeoLocatedVehicleProps(component, firstGeoLocatedVehicle))
  })

  specify('given list of two vehicles it should render both of them', () => {
    const vehicles = [firstGeoLocatedVehicle, secondGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(() => Cypress.vueWrapper.findAllComponents(GeoLocatedVehicle))
      .then(allGeoLocatedVehicleComponents => {
        expect(allGeoLocatedVehicleComponents.length).to.equal(2)
        return allGeoLocatedVehicleComponents
      })
      .then(allGeoLocatedVehicleComponents => {
        allGeoLocatedVehicleComponents.forEach((component, i) => assertGeoLocatedVehicleProps(component, vehicles[i]))
      })
  })

  it('should render vehicles under root node', () => {
    const vehicles = [firstGeoLocatedVehicle]
    mountListOfVehicles({ vehicles })

    cy.then(() => Cypress.vueWrapper.findComponent(GeoLocatedVehicle))
      .then(component => component.element as unknown as JQuery)
      .then(element => element[0].outerHTML)
      .then(html => cy.dataCy('root-node').should('have.html', html))
  })
})

function mountListOfVehicles (props: Record<string, unknown>) {
  const defaultProps = { vehicles: [] }
  const allProps = { ...defaultProps, ...props }

  mount(ListOfVehicles, {
    props: allProps,
    global: {
      stubs: {
        BaseMap: true
      }
    }
  })
}
