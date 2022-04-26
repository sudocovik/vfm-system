import { describe, expect, it } from '@jest/globals'
import { SVG, SVGWidthNotSet } from '../SVG'

describe('SVG', () => {
  describe('(method): toUrl()', () => {
    describe('should return SVG template as data URL', () => {
      it.each([
        'my-svg-data',
        'my-second-svg-data'
      ])('case %#: template = \'%s\'', (template: string) => {
        const svg = new SVG(template)
        expect(svg.toUrl()).toEqual('data:image/svg+xml,' + template)
      })
    })

    it('should URL-encode the template', () => {
      const template = '<svg>[]% </svg>'
      const encodedTemplate = encodeURIComponent(template)

      const svg = new SVG(template)
      const url = svg.toUrl()

      expect(url.endsWith(encodedTemplate)).toBeTruthy()
    })
  })

  describe('(method): havingWidth()', () => {
    it.each([24, 32])('should accept number (in pixels)', (expectedWidth: number) => {
      const svg = new SVG('').havingWidth(expectedWidth)

      expect(svg.width()).toEqual(expectedWidth)
    })
  })

  describe('(method): width()', () => {
    it('should throw exception if width has not been set', () => {
      expect.assertions(1)

      try {
        const svg = new SVG('')
        svg.width()
      }
      catch (e) {
        expect(e).toBeInstanceOf(SVGWidthNotSet)
      }
    })
  })
})

describe('SVGWidthNotSet', () => {
  it('should have a message', () => {
    expect(new SVGWidthNotSet().message).not.toEqual('')
  })

  it('should have the same name as class name', () => {
    expect(new SVGWidthNotSet().name).toEqual('SVGWidthNotSet')
  })
})
