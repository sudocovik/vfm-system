import { describe, it, expect } from '@jest/globals'
import { GoogleMapOptions } from 'src/config/GoogleMapOptions'

describe('GoogleMapOptions', () => {
  describe('apiKey()', () => {
    describe('should return key from environment variable VUE_APP_GOOGLE_MAPS_KEY', () => {
      it.each(['test-key-1', 'test-key-2'])('case %#: VUE_APP_GOOGLE_MAPS_KEY = %s', (expectedKey: string) => {
        process.env.VUE_APP_GOOGLE_MAPS_KEY = expectedKey

        expect(GoogleMapOptions.apiKey()).toEqual(expectedKey)
      })
    })
  })
})
