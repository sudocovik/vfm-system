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
      .then((type: string) => {
        expect(type).to.be.equal('email')
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

  it('should let parent component control the input value', () => {
    const defaultValues = {
      initial: 'First default value',
      secondary: 'Second default value'
    }

    mount(LoginFormEmailInput, {
      props: {
        value: defaultValues.initial
      }
    })

    cy.then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>): string => <string>input.vm.modelValue)
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValues.initial)
      })

    cy.then(() => Cypress.vueWrapper.setProps({ value: defaultValues.secondary }))

    cy.then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>): string => <string>input.vm.modelValue)
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValues.secondary)
      })
  })

  it('should notify parent what the user typed', () => {
    const expectedUserInput = 'user.email@example.com'

    mount(LoginFormEmailInput)
      .then((): VueWrapper<QInput> => Cypress.vueWrapper.findComponent(QInput))
      .then((input: VueWrapper<QInput>) => {
        void input.setValue(expectedUserInput)
      })
      .then((): string[][] => {
        const eventSequence = <string[][]>Cypress.vueWrapper.emitted('update:value')
        console.log(eventSequence)
        if (eventSequence) return eventSequence
        else throw new Error('Event \'update:value\' never occurred')
      })
      .then((eventSequence: string[][]) => {
        const lastEvent = eventSequence[eventSequence.length - 1]
        const actualUserInput: string = lastEvent[0]
        expect(actualUserInput).to.be.equal(expectedUserInput)
      })
  })
})
