import { ComponentUnderTest, inAllLanguages, InputField } from 'test/support/api'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    InputField.shouldExist()
  })

  it('should assist user while typing email', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    InputField.Type.shouldBe('email')
  })

  inAllLanguages.it('should have a label', (t) => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    InputField.Label.shouldBe(t('email'))
  })

  it('should let parent component control the email', () => {
    const defaultEmail = 'default@example.com'
    const regularEmail = 'regular@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).withModelValue(defaultEmail).mount()
    InputField.Value.shouldBe(defaultEmail)

    ComponentUnderTest.ModelValue.changeTo(regularEmail)
    InputField.Value.shouldBe(regularEmail)
  })

  it('should tell parent what email the user typed', () => {
    const typoEmail = 'user..@example.com'
    const correctEmail = 'user@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).mount()

    InputField.Value.changeTo(typoEmail)
    ComponentUnderTest.ModelValue.shouldBe(typoEmail)

    InputField.Value.changeTo(correctEmail)
    ComponentUnderTest.ModelValue.shouldBe(correctEmail)
  })
})
