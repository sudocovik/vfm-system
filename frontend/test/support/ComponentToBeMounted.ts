import { mount } from '@cypress/vue'

type ModelValue = unknown

export type VueComponent = unknown

export class ComponentToBeMounted {
  private readonly component: VueComponent
  private modelValue: ModelValue = undefined

  constructor (component: VueComponent) {
    this.component = component
  }

  public withModelValue (wantedValue: ModelValue): ComponentToBeMounted {
    this.modelValue = wantedValue
    return this
  }

  public mount (): ComponentToBeMounted {
    /*
      Property 'component' is intentionally set to 'unknown' type because there is no need to handle
      type abomination and overloading defined by mount() function from @cypress/vue module.
      If the given component is not an actual component then the runtime should complain.
      This is the reason why following line is ts-ignored.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mount(this.component, { props: { modelValue: this.modelValue } })
    return this
  }
}
