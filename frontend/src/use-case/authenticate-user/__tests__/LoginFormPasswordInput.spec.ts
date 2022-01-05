import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import {
  textInputChangeValueTo,
  textInputLabelShouldBe,
  textInputTypeShouldBe,
  textInputValueShouldBe
} from './input-utilities'
import { ComponentUnderTest } from 'test/support/ComponentUnderTest'
import { InputField } from 'test/support/InputField'

describe('LoginFormPasswordInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.shouldExist()
  })

  it('should mask characters in the text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputTypeShouldBe('password')
  })

  it('should have a label', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputLabelShouldBe('Password')
  })

  it('should let parent component control the password', () => {
    const weakPassword = '123456'
    const strongPassword = '12345678'

    ComponentUnderTest.is(LoginFormPasswordInput).withModelValue(weakPassword).mount()
    textInputValueShouldBe(weakPassword)

    ComponentUnderTest.ModelValue.changeTo(strongPassword)
    textInputValueShouldBe(strongPassword)
  })

  it('should tell parent what password the user typed', () => {
    const typoPassword = 'my-pass,wrd'
    const correctPassword = 'my-password'

    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    textInputChangeValueTo(typoPassword)
    ComponentUnderTest.ModelValue.shouldBe(typoPassword)

    textInputChangeValueTo(correctPassword)
    ComponentUnderTest.ModelValue.shouldBe(correctPassword)
  })
})
