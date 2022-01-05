import { VueWrapper } from '@vue/test-utils'
import { QInput } from 'quasar'

type InputComponent = VueWrapper<QInput>

export class InputField {
  public static shouldExist () {
    cy.then(InputField.findComponent)
      .then((input: InputComponent) => {
        expect(input.exists()).to.be.equal(true)
      })
  }

  private static findComponent (this: void): InputComponent {
    return Cypress.vueWrapper.findComponent(QInput)
  }
}
