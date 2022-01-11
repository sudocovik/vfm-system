import { ErrorMessageProperty, WrappedVueComponent } from './types'

type WrappedComponentWithErrorMessage = WrappedVueComponent<ErrorMessageProperty>

export class ErrorMessageAttribute {
  private readonly findComponent: () => WrappedComponentWithErrorMessage

  constructor (componentSearchFunction: () => WrappedComponentWithErrorMessage) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedMessage: unknown): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithErrorMessage): unknown => component.props('errorMessage') as unknown)
      .then((errorMessage: unknown) => {
        expect(errorMessage).to.be.equal(expectedMessage)
      })
  }
}
