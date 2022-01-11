import { DisableProperty, WrappedVueComponent } from './types'

type WrappedComponentWithDisabledState = WrappedVueComponent<DisableProperty>

export class DisableAttribute {
  private readonly findComponent: () => WrappedComponentWithDisabledState

  constructor (componentSearchFunction: () => WrappedComponentWithDisabledState) {
    this.findComponent = componentSearchFunction
  }

  public shouldBe (expectedState: boolean): void {
    cy.then(this.findComponent)
      .then((component: WrappedComponentWithDisabledState): boolean => component.props('disable') as boolean)
      .then((loading: boolean) => {
        console.log(this.findComponent().props())
        expect(loading).to.be.equal(expectedState)
      })
  }
}
