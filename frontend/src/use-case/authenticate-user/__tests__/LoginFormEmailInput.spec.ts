import { mount } from '@cypress/vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { QInput } from 'quasar'
import { VueWrapper } from '@vue/test-utils'

type InputComponent = VueWrapper<QInput>

const findInputComponent = () => (): InputComponent => Cypress.vueWrapper.findComponent(QInput)

const findProperty = (wantedProperty: string) => (input: InputComponent): string => input.props(wantedProperty) as string

const returnInputValue = () => (input: InputComponent): string => <string>input.vm.modelValue

const changeInputValue = (inputValue: string) => (input: InputComponent) => input.setValue(inputValue)

const findEventsByName = (name: string) => (): string[][] => {
  const eventSequence = <string[][]>Cypress.vueWrapper.emitted(name)
  if (eventSequence) return eventSequence
  else throw new Error(`Event '${name}' never occurred`)
}

const takeLastEvent = () => (eventSequence: string[][]): string[] => eventSequence[eventSequence.length - 1]

const takeFirstValue = () => (eventData: string[]): string => eventData[0]

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    mount(LoginFormEmailInput)
      .then(findInputComponent())
      .then((input: InputComponent) => {
        expect(input.exists()).to.be.equal(true)
      })
  })

  it('should assist user while typing email', () => {
    mount(LoginFormEmailInput)
      .then(findInputComponent())
      .then(findProperty('type'))
      .then((type: string) => {
        expect(type).to.be.equal('email')
      })
  })

  it('should have a placeholder', () => {
    mount(LoginFormEmailInput)
      .then(findInputComponent())
      .then(findProperty('label'))
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

    cy.then(findInputComponent())
      .then(returnInputValue())
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValues.initial)
      })

    cy.then(() => Cypress.vueWrapper.setProps({ value: defaultValues.secondary }))

    cy.then(findInputComponent())
      .then(returnInputValue())
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
      .then(findInputComponent())
      .then(changeInputValue(inputValue.initial))
      .then(findEventsByName('update:value'))
      .then(takeLastEvent())
      .then(takeFirstValue())
      .then((actualUserInput: string) => {
        expect(actualUserInput).to.be.equal(inputValue.initial)
      })

      .then(findInputComponent())
      .then(changeInputValue(inputValue.secondary))
      .then(findEventsByName('update:value'))
      .then(takeLastEvent())
      .then(takeFirstValue())
      .then((actualUserInput: string) => {
        expect(actualUserInput).to.be.equal(inputValue.secondary)
      })
  })
})
