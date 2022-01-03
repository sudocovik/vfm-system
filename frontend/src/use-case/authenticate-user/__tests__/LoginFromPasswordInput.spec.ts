import { mount } from '@cypress/vue'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import {
  changeComponentProperties,
  componentModelValueShouldBe,
  textInputChangeValueTo,
  textInputLabelShouldBe,
  textInputShouldExist,
  textInputTypeShouldBe,
  textInputValueShouldBe
} from './input-utilities'

describe('LoginFormPasswordInput', () => {
  it('should render text input', () => {
    mount(LoginFormPasswordInput)

    textInputShouldExist()
  })

  it('should mask characters in the text input', () => {
    mount(LoginFormPasswordInput)

    textInputTypeShouldBe('password')
  })

  it('should have a placeholder', () => {
    mount(LoginFormPasswordInput)

    textInputLabelShouldBe('Password')
  })

  it('should let parent component control the input value', () => {
    const defaultValue = '123456'
    const changedValue = '12345678'

    mount(LoginFormPasswordInput, {
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

    mount(LoginFormPasswordInput)

    textInputChangeValueTo(firstValue)
    componentModelValueShouldBe(firstValue)

    textInputChangeValueTo(secondValue)
    componentModelValueShouldBe(secondValue)
  })
})
