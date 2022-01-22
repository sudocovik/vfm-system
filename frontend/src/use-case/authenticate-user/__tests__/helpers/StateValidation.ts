import LoginFormEmailInput from '../../LoginFormEmailInput.vue'
import LoginFormPasswordInput from '../../LoginFormPasswordInput.vue'
import LoginFormSubmitButton from '../../LoginFormSubmitButton.vue'
import { StateExpectationAttributes } from './StateExpectationAttributes'
import { StateExpectation } from './StateExpectation'

export class StateValidation {
  public static validate (expectation: StateExpectation) {
    const fields: StateExpectationAttributes = expectation.toAttributes()
    const { email, password, submit } = fields

    cy.then(() => {
      const emailInput = Cypress.vueWrapper.findComponent(LoginFormEmailInput)
      expect(emailInput.props('disabled')).to.be.equal(email.disabled)
      expect(emailInput.props('error')).to.be.equal(email.error)

      const passwordInput = Cypress.vueWrapper.findComponent(LoginFormPasswordInput)
      expect(passwordInput.props('disabled')).to.be.equal(password.disabled)
      expect(passwordInput.props('error')).to.be.equal(password.error)

      const submitButton = Cypress.vueWrapper.findComponent(LoginFormSubmitButton)
      expect(submitButton.props('disabled')).to.be.equal(submit.disabled)
      expect(submitButton.props('loading')).to.be.equal(submit.loading)
    })
  }
}
