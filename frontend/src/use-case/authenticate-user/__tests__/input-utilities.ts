import { VueWrapper } from '@vue/test-utils'
import { QInput } from 'quasar'

type InputComponent = VueWrapper<QInput>

export const textInputShouldExist = (): void => {
  cy.then(findInputComponent())
    .then((input: InputComponent) => {
      expect(input.exists()).to.be.equal(true)
    })
}

export const textInputLabelShouldBe = (wantedLabel: string): void => {
  cy.then(findInputComponent())
    .then(findProperty('label'))
    .then((label: string) => {
      expect(label).to.be.equal(wantedLabel)
    })
}

export const textInputValueShouldBe = (wantedValue: string): void => {
  cy.then(findInputComponent())
    .then(returnInputValue())
    .then((inputValue: string) => {
      expect(inputValue).to.be.equal(wantedValue)
    })
}

export const textInputChangeValueTo = (wantedValue: string): void => {
  cy.then(findInputComponent())
    .then(changeInputValue(wantedValue))
}

const findInputComponent = () => (): InputComponent => Cypress.vueWrapper.findComponent(QInput)

const findProperty = (wantedProperty: string) => (input: InputComponent): string => input.props(wantedProperty) as string

const returnInputValue = () => (input: InputComponent): string => <string>input.vm.modelValue

const changeInputValue = (inputValue: string) => (input: InputComponent) => input.setValue(inputValue)
