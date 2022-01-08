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

  it('should hide loading spinner on initial render', () => {
    const inactive = false
    ComponentUnderTest.is(LoginFormSubmitButton).mount()

    Button.Loading.shouldBe(inactive)
  })

  it('should show loading spinner on demand', () => {
    const active = true
    ComponentUnderTest.is(LoginFormSubmitButton).withProperties({ loading: active }).mount()

    Button.Loading.shouldBe(active)
  })
})
