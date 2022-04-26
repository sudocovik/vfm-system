import { describe, expect, it } from '@jest/globals'
import { SVG } from '../SVG'

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
})
