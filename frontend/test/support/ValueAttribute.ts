import { ModelValueProperty, WrappedVueComponent } from './types'

type WrappedComponentWithModelValue = WrappedVueComponent<ModelValueProperty>

export class ValueAttribute {
  private readonly findComponent: () => WrappedComponentWithModelValue

  constructor (componentSearchFunction: () => WrappedComponentWithModelValue) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithModelValue): string => <string>component.vm.modelValue)
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }

  public changeTo (wantedValue: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithModelValue) => {
        void component.setValue(wantedValue)
      })
  }
}
