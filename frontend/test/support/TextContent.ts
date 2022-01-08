import { WrappedVueComponent } from './types'

export class TextContent {
  private readonly findComponent: () => WrappedVueComponent

  constructor (componentSearchFunction: () => WrappedVueComponent) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: string): void {
    cy.then(this.findComponent)
      .then((component: WrappedVueComponent): string => component.element.textContent?.trim() ?? '')
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }
}
