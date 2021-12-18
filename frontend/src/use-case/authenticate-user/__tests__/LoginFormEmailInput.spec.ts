import { mount } from '@cypress/vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { QInput } from 'quasar'
import { VueWrapper } from '@vue/test-utils'

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>) => {
        expect(input.exists()).to.be.equal(true)
      })
  })

  it('should use \'outlined\' design', () => {
    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>): string[] => Object.keys(input.props()))
      .then((props: string[]) => {
        expect(props).to.contain('outlined')
      })
  })

  it('should assist user while typing email', () => {
    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>): string => input.props('type') as string)
      .then((props: string) => {
        expect(props).to.be.equal('email')
      })
  })

  it('should have a placeholder', () => {
    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>): string => input.props('label') as string ?? '')
      .then((label: string) => {
        expect(label).to.be.equal('E-mail')
      })
  })
})
