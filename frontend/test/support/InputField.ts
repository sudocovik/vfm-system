import { VueWrapper } from '@vue/test-utils'
import { QInput } from 'quasar'
import { TypeAttribute } from './TypeAttribute'
import { LabelAttribute } from './LabelAttribute'
import { ValueAttribute } from './ValueAttribute'
import { DisableAttribute } from './DisableAttribute'

type InputComponent = VueWrapper<QInput>

export class InputField {
  public static Type = new TypeAttribute(InputField.findComponent)

  public static Label = new LabelAttribute(InputField.findComponent)

  public static Value = new ValueAttribute(InputField.findComponent)

  public static Disable = new DisableAttribute(InputField.findComponent)

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
