import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'
import { ComponentUnderTest, Button } from 'test/support/api'

describe('LoginFormSubmitButton', () => {
  it('should render a button', () => {
    ComponentUnderTest.is(LoginFormSubmitButton).mount()

    Button.shouldExist()
  })

  it('should be a submit button', () => {
    ComponentUnderTest.is(LoginFormSubmitButton).mount()

    Button.Type.shouldBe('submit')
  })
})
