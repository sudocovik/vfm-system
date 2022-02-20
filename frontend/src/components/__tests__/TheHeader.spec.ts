import { ComponentUnderTest } from 'test/support/api'
import TheHeader from '../TheHeader.vue'

describe('TheHeader', () => {
  it('should mount', () => {
    ComponentUnderTest.is(TheHeader).mount()
  })
})
