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

const changeComponentProperties = (changedProperties: Record<string, unknown>) =>
  () => Cypress.vueWrapper.setProps(changedProperties)

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
    const defaultValue = 'First default value'
    const changedValue = 'Second default value'

    mount(LoginFormEmailInput, {
      props: {
        modelValue: defaultValue
      }
    })

    cy.then(findInputComponent())
      .then(returnInputValue())
      .then((inputValue) => {
        expect(inputValue).to.be.equal(defaultValue)
      })

    cy.then(changeComponentProperties({ modelValue: changedValue }))

    cy.then(findInputComponent())
      .then(returnInputValue())
      .then((inputValue) => {
        expect(inputValue).to.be.equal(changedValue)
      })
  })

  it('should notify parent what the user typed', () => {
    const firstValue = 'user.email@example.com'
    const secondValue = 'user.email2@example.com'

    mount(LoginFormEmailInput)
      .then(findInputComponent())
      .then(changeInputValue(firstValue))
      .then(findEventsByName('update:modelValue'))
      .then(takeLastEvent())
      .then(takeFirstValue())
      .then((actualUserInput: string) => {
        expect(actualUserInput).to.be.equal(firstValue)
      })

      .then(findInputComponent())
      .then(changeInputValue(secondValue))
      .then(findEventsByName('update:modelValue'))
      .then(takeLastEvent())
      .then(takeFirstValue())
      .then((actualUserInput: string) => {
        expect(actualUserInput).to.be.equal(secondValue)
      })
  })
})
