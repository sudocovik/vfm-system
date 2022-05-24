import { describe, it, expect } from '@jest/globals'
import { Speed } from '../'

const fifteen = { knots: 15, kph: 27.78 }
const six = { knots: 6, kph: 11.112 }

describe('Speed', () => {
  describe('Knots', () => {
    it('should return same value when converting to Knots', () => {
      expect(Speed.fromKnots(fifteen.knots).toKnots()).toEqual(fifteen.knots)
      expect(Speed.fromKnots(six.knots).toKnots()).toEqual(six.knots)
    })

    it('should correctly convert to Kph', () => {
      expect(Speed.fromKnots(fifteen.knots).toKph()).toEqual(fifteen.kph)
      expect(Speed.fromKnots(six.knots).toKph()).toEqual(six.kph)
    })
  })

  describe('Kilometers per hour', () => {
    it('should return same value when converting to Kph', () => {
      expect(Speed.fromKph(fifteen.kph).toKph()).toEqual(fifteen.kph)
      expect(Speed.fromKph(six.kph).toKph()).toEqual(six.kph)
    })

    it('should correctly convert to Knots', () => {
      expect(Speed.fromKph(fifteen.kph).toKnots()).toEqual(fifteen.knots)
      expect(Speed.fromKph(six.kph).toKnots()).toEqual(six.knots)
    })
  })
})
