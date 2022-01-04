import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import {
  textInputChangeValueTo,
  textInputLabelShouldBe,
  textInputShouldExist,
  textInputTypeShouldBe,
  textInputValueShouldBe
} from './input-utilities'
import { ComponentUnderTest } from 'app/test/support/ComponentUnderTest'

describe('LoginFormPasswordInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputShouldExist()
  })

  it('should mask characters in the text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputTypeShouldBe('password')
  })

  it('should have a placeholder', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputLabelShouldBe('Password')
  })

  it('should let parent component control the input value', () => {
    const defaultValue = '123456'
    const changedValue = '12345678'

    ComponentUnderTest.is(LoginFormPasswordInput).withModelValue(defaultValue).mount()
    textInputValueShouldBe(defaultValue)

    ComponentUnderTest.ModelValue.changeTo(changedValue)
    textInputValueShouldBe(changedValue)
  })

  it('should notify parent what the user typed', () => {
    const firstValue = 'user.email@example.com'
    const secondValue = 'user.email2@example.com'

    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputChangeValueTo(firstValue)
    ComponentUnderTest.ModelValue.shouldBe(firstValue)

    textInputChangeValueTo(secondValue)
    ComponentUnderTest.ModelValue.shouldBe(secondValue)
  })
})
