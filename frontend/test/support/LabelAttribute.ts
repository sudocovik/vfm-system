import { LabelProperty, WrappedVueComponent } from './types'

type WrappedComponentWithLabel = WrappedVueComponent<LabelProperty>

export class LabelAttribute {
  private readonly findComponent: () => WrappedComponentWithLabel

  constructor (componentSearchFunction: () => WrappedComponentWithLabel) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithLabel): string => component.props('label') as string)
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }
}
