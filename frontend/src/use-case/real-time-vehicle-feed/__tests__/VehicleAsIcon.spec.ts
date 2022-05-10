import { colors, createVehicleIcon } from '../VehicleAsIcon'

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

    specify('circles should be under rotation group', () => {
      const icon = createVehicleIcon(true, false)
      mountIcon(icon)

      cy.dataCy('rotation-group').dataCy('background-stroke').should('be.visible')
      cy.dataCy('rotation-group').dataCy('background-fill').should('be.visible')
    })
  })

  describe('Direction arrow', () => {
    it('should be rendered when property \'moving\' is true', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('exist')
    })

    it('should not be rendered when property \'moving\' is false', () => {
      const icon = createVehicleIcon(false)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('not.exist')
    })

    it('should be node of type \'path\'', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').then($el => {
        expect($el.get(0).nodeName).equal('path')
      })
    })

    it('should have a stroke color', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('have.attr', 'stroke') // not interested in actual color, covered by other tests
    })

    it('should have a stroke width of 1', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('have.attr', 'stroke-width', 1)
    })

    it('should have a fill color', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('have.attr', 'fill') // not interested in actual color, covered by other tests
    })

    it('should have a shape', () => {
      const icon = createVehicleIcon(true)
      mountIcon(icon)

      cy.dataCy('direction-arrow').should('have.attr', 'd') // shape is a bit complex, test it visually
      cy.dataCy('direction-arrow').should('have.attr', 'transform') // required to be properly centered but depends on 'd' attribute so value is not tested
    })

    it('should be under rotation group', () => {
      const icon = createVehicleIcon(true, false)
      mountIcon(icon)

      cy.dataCy('rotation-group').dataCy('direction-arrow').should('be.visible')
    })

    describe('Rotation', () => {
      it('should rotate around center of the icon', () => {
        const icon = createVehicleIcon(true, false)
        mountIcon(icon)

        const center = '16 16'

        cy.dataCy('rotation-group').should('have.attr', 'transform').should('match', new RegExp(`rotate\\(\\d ${center}\\)`))
      })

      it('should have a default value of 0', () => {
        const icon = createVehicleIcon(true, false)
        mountIcon(icon)

        iconRotationShouldBe(0)
      })

      const rotations = [15, 270]
      rotations.forEach((rotation, i) => {
        it(`case ${i + 1}: rotation = ${rotation}`, () => {
          const icon = createVehicleIcon(true, false, rotation)
          mountIcon(icon)

          iconRotationShouldBe(rotation)
        })
      })
    })

    describe('Colors', () => {
      it('should have a yellow-like stroke & fill color when property \'ignition\' is false', () => {
        const icon = createVehicleIcon(true, false)
        mountIcon(icon)

        cy.dataCy('direction-arrow').should('have.attr', 'stroke', colors.yellow.stroke)
        cy.dataCy('direction-arrow').should('have.attr', 'fill', colors.yellow.fill)
      })

      it('should have a green-like stroke & fill color when property \'ignition\' is true', () => {
        const icon = createVehicleIcon(true, true)
        mountIcon(icon)

        cy.dataCy('direction-arrow').should('have.attr', 'stroke', colors.green.stroke)
        cy.dataCy('direction-arrow').should('have.attr', 'fill', colors.green.fill)
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

function iconRotationShouldBe (rotation: number) {
  cy.get('svg').dataCy('rotation-group').should('have.attr', 'transform').should('contain', `rotate(${rotation}`)
}
