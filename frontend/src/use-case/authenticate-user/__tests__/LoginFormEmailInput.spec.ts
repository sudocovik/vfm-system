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
    const defaultValue = 'First default value'
    const changedValue = 'Second default value'

    ComponentUnderTest.is(LoginFormEmailInput).withModelValue(defaultValue).mount()
    textInputValueShouldBe(defaultValue)

    ComponentUnderTest.ModelValue.changeTo(changedValue)
    textInputValueShouldBe(changedValue)
  })

  it('should notify parent what the user typed', () => {
    const firstValue = 'user.email@example.com'
    const secondValue = 'user.email2@example.com'

    ComponentUnderTest.is(LoginFormEmailInput).mount()

    textInputChangeValueTo(firstValue)
    ComponentUnderTest.ModelValue.shouldBe(firstValue)

    textInputChangeValueTo(secondValue)
    ComponentUnderTest.ModelValue.shouldBe(secondValue)
  })
})
