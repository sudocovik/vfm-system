import { mount } from '@cypress/vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import {
  componentModelValueShouldBe,
  textInputChangeValueTo,
  textInputLabelShouldBe,
  textInputShouldExist,
  textInputTypeShouldBe,
  textInputValueShouldBe
} from 'src/use-case/authenticate-user/__tests__/input-utilities'

const changeComponentProperties = (changedProperties: Record<string, unknown>) =>
  () => Cypress.vueWrapper.setProps(changedProperties)

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    mount(LoginFormEmailInput)

    textInputShouldExist()
  })

  it('should assist user while typing email', () => {
    mount(LoginFormEmailInput)

    textInputTypeShouldBe('email')
  })

  it('should have a placeholder', () => {
    mount(LoginFormEmailInput)

    textInputLabelShouldBe('E-mail')
  })

  it('should let parent component control the input value', () => {
    const defaultValue = 'First default value'
    const changedValue = 'Second default value'

    mount(LoginFormEmailInput, {
      props: {
        modelValue: defaultValue
      }
    })
    textInputValueShouldBe(defaultValue)

    cy.then(changeComponentProperties({ modelValue: changedValue }))
    textInputValueShouldBe(changedValue)
  })

  it('should notify parent what the user typed', () => {
    const firstValue = 'user.email@example.com'
    const secondValue = 'user.email2@example.com'

    mount(LoginFormEmailInput)

    textInputChangeValueTo(firstValue)
    componentModelValueShouldBe(firstValue)

    textInputChangeValueTo(secondValue)
    componentModelValueShouldBe(secondValue)
  })
})
