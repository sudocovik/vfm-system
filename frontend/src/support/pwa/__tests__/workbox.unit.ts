import { describe, expect, it } from '@jest/globals'
import { QuasarPwaConfiguration } from '@quasar/app-webpack/types/configuration/pwa-conf'
import config from 'app/quasar.conf'

describe('Workbox', () => {
  it('should not claim clients', () => {
    expect(pwaOptions().workboxOptions).toHaveProperty('clientsClaim', false)
  })

  it('should not unconditionally call skipWaiting', () => {
    expect(pwaOptions().workboxOptions).toHaveProperty('skipWaiting', false)
  })
})

function pwaOptions (): QuasarPwaConfiguration {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return config({}).pwa
}
