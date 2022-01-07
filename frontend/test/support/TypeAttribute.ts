import { WrappedVueComponent, TypeProperty } from './types'

type WrappedComponentWithType = WrappedVueComponent<TypeProperty>

export class TypeAttribute {
  private readonly findComponent: () => WrappedComponentWithType

  constructor (componentSearchFunction: () => WrappedComponentWithType) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedType: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithType): string => component.props('type') as string)
      .then((type: string) => {
        expect(type).to.be.equal(expectedType)
      })
  }
}
