import { Attributes, Properties, VueComponent } from './types'

type ModelValue = unknown

export class ComponentToBeMounted {
  private readonly component: VueComponent
  private modelValue: ModelValue = undefined
  private properties: Properties = {}
  private attributes?: Attributes = undefined

  constructor (component: VueComponent) {
    this.component = component
  }

  public withModelValue (wantedValue: ModelValue): ComponentToBeMounted {
    this.modelValue = wantedValue
    return this
  }

  public withProperties (wantedProperties: Properties): ComponentToBeMounted {
    this.properties = wantedProperties
    return this
  }

  public withAttributes (wantedAttributes: Attributes): ComponentToBeMounted {
    this.attributes = wantedAttributes
    return this
  }

  public mount (): ComponentToBeMounted {
    const allComponentProperties = {
      ...this.properties,
      ...(this.modelValue !== undefined ? { modelValue: this.modelValue } : {})
    }

    cy.mount(this.component, { props: allComponentProperties, attrs: this.attributes })
    return this
  }
}
