import { LoadingProperty, WrappedVueComponent } from './types'

type WrappedComponentWithLoadingState = WrappedVueComponent<LoadingProperty>

export class LoadingAttribute {
  private readonly findComponent: () => WrappedComponentWithLoadingState

  constructor (componentSearchFunction: () => WrappedComponentWithLoadingState) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedState: boolean): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithLoadingState): boolean => component.props('loading') as boolean)
      .then((loading: boolean) => {
        expect(loading).to.be.equal(expectedState)
      })
  }
}
