import { WrappedVueComponent } from './WrappedVueComponent'

export class TypeAttribute {
  private readonly findComponent: () => WrappedVueComponent

  constructor (componentSearchFunction: () => WrappedVueComponent) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedVueComponent): string => component.props('type') as string)
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }
}
