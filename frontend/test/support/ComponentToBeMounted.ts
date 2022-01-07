import { mount } from '@cypress/vue'

type ModelValue = unknown

type Properties = Record<string, unknown>

export type VueComponent = unknown

export class ComponentToBeMounted {
  private readonly component: VueComponent
  private modelValue: ModelValue = undefined
  private properties: Properties = {}

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

  public mount (): ComponentToBeMounted {
    const allComponentProperties = {
      ...this.properties,
      modelValue: this.modelValue
    }

    /*
      Property 'component' is intentionally set to 'unknown' type because there is no need to handle
      type abomination and overloading defined by mount() function from @cypress/vue module.
      If the given component is not an actual component then the runtime should complain.
      This is the reason why following line is ts-ignored.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mount(this.component, { props: allComponentProperties })
    return this
  }
}
