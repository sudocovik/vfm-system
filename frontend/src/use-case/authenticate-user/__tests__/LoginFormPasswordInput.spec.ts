import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import { ComponentUnderTest, InputField } from 'test/support/api'

describe('LoginFormPasswordInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.shouldExist()
  })

  it('should mask characters in the text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Type.shouldBe('password')
  })

  it('should have a label', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Label.shouldBe('Password')
  })

  it('should let parent component control the password', () => {
    const weakPassword = '123456'
    const strongPassword = '12345678'

    ComponentUnderTest.is(LoginFormPasswordInput).withModelValue(weakPassword).mount()
    InputField.Value.shouldBe(weakPassword)

    ComponentUnderTest.ModelValue.changeTo(strongPassword)
    InputField.Value.shouldBe(strongPassword)
  })

  it('should tell parent what password the user typed', () => {
    const typoPassword = 'my-pass,wrd'
    const correctPassword = 'my-password'

    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Value.changeTo(typoPassword)
    ComponentUnderTest.ModelValue.shouldBe(typoPassword)

    InputField.Value.changeTo(correctPassword)
    ComponentUnderTest.ModelValue.shouldBe(correctPassword)
  })
})
