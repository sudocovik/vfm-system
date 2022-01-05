import { VueWrapper } from '@vue/test-utils'
import { QInput } from 'quasar'
import { TypeAttribute } from './TypeAttribute'
import { LabelAttribute } from 'app/test/support/LabelAttribute'

type InputComponent = VueWrapper<QInput>

export class InputField {
  public static Type: TypeAttribute = new TypeAttribute(InputField.findComponent)

  public static Label: LabelAttribute = new LabelAttribute(InputField.findComponent)

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
