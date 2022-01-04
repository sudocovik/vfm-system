import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import {
  textInputChangeValueTo,
  textInputLabelShouldBe,
  textInputShouldExist,
  textInputTypeShouldBe,
  textInputValueShouldBe
} from './input-utilities'
import { ComponentUnderTest } from 'test/support/ComponentUnderTest'

describe('LoginFormEmailInput', () => {
  it('should render text input', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputShouldExist()
  })

  it('should assist user while typing email', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputTypeShouldBe('email')
  })

  it('should have a label', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputLabelShouldBe('E-mail')
  })

  it('should let parent component control the email', () => {
    const defaultEmail = 'default@example.com'
    const regularEmail = 'regular@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).withModelValue(defaultEmail).mount()
    textInputValueShouldBe(defaultEmail)

    ComponentUnderTest.ModelValue.changeTo(regularEmail)
    textInputValueShouldBe(regularEmail)
  })

  it('should tell parent what email the user typed', () => {
    const typoEmail = 'user..@example.com'
    const correctEmail = 'user@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputChangeValueTo(typoEmail)
    ComponentUnderTest.ModelValue.shouldBe(typoEmail)

    textInputChangeValueTo(correctEmail)
    ComponentUnderTest.ModelValue.shouldBe(correctEmail)
  })
})
