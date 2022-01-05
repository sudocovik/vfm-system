import { WrappedVueComponent } from 'app/test/support/WrappedVueComponent'

export class LabelAttribute {
  private readonly findComponent: () => WrappedVueComponent

  constructor (componentSearchFunction: () => WrappedVueComponent) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedVueComponent): string => component.props('label') as string)
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }
}
