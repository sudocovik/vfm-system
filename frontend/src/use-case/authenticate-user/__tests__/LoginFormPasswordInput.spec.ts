import { ComponentUnderTest, inAllLanguages, InputField } from 'test/support/api'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'

describe('LoginFormPasswordInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.shouldExist()
  })

  it('should mask characters in the text input', () => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Type.shouldBe('password')
  })

  inAllLanguages.it('should have a label', (t) => {
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Label.shouldBe(t('password'))
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

  it('should not be disabled on initial render', () => {
    const inactive = false
    ComponentUnderTest.is(LoginFormPasswordInput).mount()

    InputField.Disable.shouldBe(inactive)
  })

  it('should be disabled on demand', () => {
    const active = true
    ComponentUnderTest.is(LoginFormPasswordInput).withProperties({ disabled: active }).mount()

    InputField.Disable.shouldBe(active)
  })

  it('should have empty error message on initial render', () => {
    const inactive = false
    const empty = ''

    ComponentUnderTest.is(LoginFormPasswordInput).mount()
    InputField.Error.shouldBe(inactive)
    InputField.ErrorMessage.shouldBe(empty)
  })

  it('should render error message below input field', () => {
    const active = true
    const fieldIsRequired = 'This field is required.'
    const fieldHasMinimumLength = 'This field requires minimum length of X'

    ComponentUnderTest.is(LoginFormPasswordInput).withProperties({ error: fieldIsRequired }).mount()
    InputField.Error.shouldBe(active)
    InputField.ErrorMessage.shouldBe(fieldIsRequired)

    ComponentUnderTest.changeProperties({ error: fieldHasMinimumLength })
    InputField.Error.shouldBe(active)
    InputField.ErrorMessage.shouldBe(fieldHasMinimumLength)
  })
})
