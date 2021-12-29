import { mount } from '@cypress/vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { QInput } from 'quasar'
import { VueWrapper } from '@vue/test-utils'

type InputComponent = VueWrapper<QInput>

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    mount(LoginFormEmailInput)
      .then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent) => {
        expect(input.exists()).to.be.equal(true)
      })
  })

  it('should assist user while typing email', () => {
    mount(LoginFormEmailInput)
      .then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent): string => input.props('type') as string)
      .then((type: string) => {
        expect(type).to.be.equal('email')
      })
  })

  it('should have a placeholder', () => {
    mount(LoginFormEmailInput)
      .then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent): string => input.props('label') as string ?? '')
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

    cy.then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent): string => <string>input.vm.modelValue)
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValues.initial)
      })

    cy.then(() => Cypress.vueWrapper.setProps({ value: defaultValues.secondary }))

    cy.then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent): string => <string>input.vm.modelValue)
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValues.secondary)
      })
  })

  it('should notify parent what the user typed', () => {
    const inputValue = {
      initial: 'user.email@example.com',
      secondary: 'user.email2@example.com'
    }

    mount(LoginFormEmailInput)
      .then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent) => {
        void input.setValue(inputValue.initial)
      })
      .then((): string[][] => {
        const eventSequence = <string[][]>Cypress.vueWrapper.emitted('update:value')
        if (eventSequence) return eventSequence
        else throw new Error('Event \'update:value\' never occurred')
      })
      .then((eventSequence: string[][]) => {
        const lastEvent = eventSequence[eventSequence.length - 1]
        const actualUserInput: string = lastEvent[0]
        expect(actualUserInput).to.be.equal(inputValue.initial)
      })

    cy.then((): InputComponent => Cypress.vueWrapper.findComponent(QInput))
      .then((input: InputComponent) => {
        void input.setValue(inputValue.secondary)
      })
      .then((): string[][] => {
        const eventSequence = <string[][]>Cypress.vueWrapper.emitted('update:value')
        if (eventSequence) return eventSequence
        else throw new Error('Event \'update:value\' never occurred')
      })
      .then((eventSequence: string[][]) => {
        const lastEvent = eventSequence[eventSequence.length - 1]
        const actualUserInput: string = lastEvent[0]
        expect(actualUserInput).to.be.equal(inputValue.secondary)
      })
  })
})
