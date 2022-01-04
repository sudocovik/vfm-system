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

  it('should have a placeholder', () => {
    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputLabelShouldBe('E-mail')
  })

  it('should let parent component control the input value', () => {
    const defaultEmail = 'default@example.com'
    const regularEmail = 'regular@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).withModelValue(defaultEmail).mount()
    textInputValueShouldBe(defaultEmail)

    ComponentUnderTest.ModelValue.changeTo(regularEmail)
    textInputValueShouldBe(regularEmail)
  })

  it('should notify parent what the user typed', () => {
    const typoEmail = 'user..@example.com'
    const correctedEmail = 'user@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputChangeValueTo(typoEmail)
    ComponentUnderTest.ModelValue.shouldBe(typoEmail)

    textInputChangeValueTo(correctedEmail)
    ComponentUnderTest.ModelValue.shouldBe(correctedEmail)
  })
})
