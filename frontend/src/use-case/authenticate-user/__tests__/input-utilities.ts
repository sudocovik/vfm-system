import { VueWrapper } from '@vue/test-utils'
import { QInput } from 'quasar'

type InputComponent = VueWrapper<QInput>

export const textInputShouldExist = (): void => {
  cy.then(findInputComponent())
    .then((input: InputComponent) => {
      expect(input.exists()).to.be.equal(true)
    })
}

export const textInputTypeShouldBe = (wantedType: string): void => {
  cy.then(findInputComponent())
    .then(findProperty('type'))
    .then((type: string) => {
      expect(type).to.be.equal(wantedType)
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

export const componentModelValueShouldBe = (wantedValue: string): void => {
  cy.then(findEventsByName('update:modelValue'))
    .then(takeLastEvent())
    .then(takeFirstValue())
    .then((firstValue: string) => {
      expect(firstValue).to.be.equal(wantedValue)
    })
}

export const changeComponentProperties = (changedProperties: Record<string, unknown>) =>
  () => Cypress.vueWrapper.setProps(changedProperties)

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
