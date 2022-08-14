import { VueWrapper } from '@vue/test-utils'
import { QBtn } from 'quasar'
import { TypeAttribute } from './TypeAttribute'
import { LoadingAttribute } from './LoadingAttribute'
import { TextContent } from './TextContent'
import { DisableAttribute } from './DisableAttribute'

type ButtonComponent = VueWrapper<QBtn>

export class Button {
  public static Type = new TypeAttribute(Button.findComponent)

  public static Loading = new LoadingAttribute(Button.findComponent)

  public static TextContent = new TextContent(Button.findComponent)

  public static Disable = new DisableAttribute(Button.findComponent)

  public static shouldExist () {
    cy.then(Button.findComponent)
      .then((input: ButtonComponent) => {
        expect(input.exists()).to.be.equal(true)
      })
  }

  private static findComponent (this: void): ButtonComponent {
    return Cypress.vueWrapper.findComponent(QBtn) as unknown as ButtonComponent
  }
}
