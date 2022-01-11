import { ComponentToBeMounted } from 'test/support/ComponentToBeMounted'
import { ModelValueProperty } from 'test/support/ModelValueProperty'
import { Properties, VueComponent } from './types'

export class ComponentUnderTest {
  public static ModelValue: ModelValueProperty = new ModelValueProperty()

  public static is (component: VueComponent): ComponentToBeMounted {
    return new ComponentToBeMounted(component)
  }

  public static changeProperties (wantedProperties: Properties): void {
    cy.then(() => Cypress.vueWrapper.setProps(wantedProperties))
  }
}
