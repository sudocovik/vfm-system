import { mount } from '@cypress/vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { QInput } from 'quasar'
import { VueWrapper } from '@vue/test-utils'

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => {
        return Cypress.vueWrapper.findComponent(QInput)
      })
      .then((input: VueWrapper<QInput>) => {
        expect(input.exists()).to.be.equal(true)
      })
  })
})
