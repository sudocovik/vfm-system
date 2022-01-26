import LoginPage from '../LoginPage.vue'
import { mount } from '@cypress/vue'
import LoginForm from '../LoginForm.vue'
import { FormState, LoginFormState } from '../LoginFormState'

describe('LoginPage', () => {
  it('should render form in \'ready\' state upon initial render', () => {
    mountLoginPage()

    formStateShouldBe(LoginFormState.ready())
  })
})

function mountLoginPage (): void {
  mount(LoginPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true
      }
    }
  })
}

function formStateShouldBe (expectedState: FormState): void {
  cy.then(() => {
    const loginForm = Cypress.vueWrapper.findComponent(LoginForm)
    const currentState = <FormState>loginForm.props('state')

    expect(currentState.constructor.name).to.be.equal(expectedState.constructor.name)
    expect(currentState.emailError()).to.be.equal(expectedState.emailError())
    expect(currentState.passwordError()).to.be.equal(expectedState.passwordError())
  })
}
