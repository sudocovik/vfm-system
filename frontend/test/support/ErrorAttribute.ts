import { ErrorProperty, WrappedVueComponent } from './types'

type WrappedComponentWithErrorState = WrappedVueComponent<ErrorProperty>

export class ErrorAttribute {
  private readonly findComponent: () => WrappedComponentWithErrorState

  constructor (componentSearchFunction: () => WrappedComponentWithErrorState) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedState: boolean): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithErrorState): boolean => component.props('error') as boolean)
      .then((error: boolean) => {
        console.log(this.findComponent().props())
        expect(error).to.be.equal(expectedState)
      })
  }
}
