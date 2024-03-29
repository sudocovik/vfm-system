import { ComponentUnderTest, Button, inAllLanguages } from 'test/support/api'
import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'

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

  inAllLanguages.it('should have a valid title', (t) => {
    ComponentUnderTest.is(LoginFormSubmitButton).mount()

    Button.TextContent.shouldBe(t('login'))
  })

  it('should not be disabled on initial render', () => {
    const inactive = false
    ComponentUnderTest.is(LoginFormSubmitButton).mount()

    Button.Disable.shouldBe(inactive)
  })

  it('should be disabled on demand', () => {
    const active = true
    ComponentUnderTest.is(LoginFormSubmitButton).withProperties({ disabled: active }).mount()

    Button.Disable.shouldBe(active)
  })
})
