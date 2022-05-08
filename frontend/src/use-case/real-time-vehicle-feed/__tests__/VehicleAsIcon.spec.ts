import { createVehicleIcon } from '../VehicleAsIcon'

describe('VehicleAsIcon', () => {
  beforeEach(resetScene)

  it('should have only one root SVG node', () => {
    const icon = createVehicleIcon()
    mountIcon(icon)

    cy.get('svg').should('have.length', 1)
  })

  describe('Root svg', () => {
    it('should have an XML namespace', () => {
      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
    })

    specify('viewBox should start at the top-left corner', () => {
      const topLeftCorner = '0 0'

      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').should('have.attr', 'viewBox').then((viewBox: unknown) => {
        expect((viewBox as string).startsWith(topLeftCorner)).to.equal(true)
      })
    })

    specify('viewBox should be 32 pixels wide and high', () => {
      const size = '32 32'

      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').should('have.attr', 'viewBox').then((viewBox: unknown) => {
        expect((viewBox as string).endsWith(size)).to.equal(true)
      })
    })
  })

  describe('Background', () => {
    specify('two circles should exist: first simulates stroke, second is fill', () => {
      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').as('root')

      cy.get('@root').dataCy('background-stroke').should('exist')
      cy.get('@root').dataCy('background-fill').should('exist')
    })

    specify('circles should be positioned at the center', () => {
      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').as('root')

      cy.get('@root').dataCy('background-stroke').should('have.attr', 'cx', 16)
      cy.get('@root').dataCy('background-stroke').should('have.attr', 'cy', 16)

      cy.get('@root').dataCy('background-fill').should('have.attr', 'cx', 16)
      cy.get('@root').dataCy('background-fill').should('have.attr', 'cx', 16)
    })

    specify('circles should be full size with \'fill\' circle being slightly smaller', () => {
      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').as('root')

      cy.get('@root').dataCy('background-stroke').should('have.attr', 'r', 16)
      cy.get('@root').dataCy('background-fill').should('have.attr', 'r', 15)
    })

    specify('circles should have different fill color', () => {
      const icon = createVehicleIcon()
      mountIcon(icon)

      cy.get('svg').as('root')

      cy.get('@root').dataCy('background-stroke').should('have.attr', 'fill').then(firstCircleFillColor => {
        cy.get('@root').dataCy('background-fill').should('have.attr', 'fill').should('not.equal', firstCircleFillColor)
      })
    })
  })
})

function resetScene () {
  cy.document({ log: false }).invoke({ log: false }, 'open')
}

function mountIcon (icon: string) {
  cy.document({ log: false }).invoke({ log: false }, 'write', icon)
}
