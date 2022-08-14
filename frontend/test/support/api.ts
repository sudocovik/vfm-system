import { ComponentConstructor } from 'quasar'
import { AllowedComponentProps, ExtractPropTypes, VNode, VNodeProps } from 'vue'
import { DefinedComponent } from 'cypress/vue/dist/@vue/test-utils/types'

export * from './ComponentUnderTest'
export * from './InputField'
export * from './Button'
export * from './inAllLanguages'
export * from './Event'
export * from './Random'
export * from './getComponentKey'

export type QuasarComponentPublicApi<T> = T extends ComponentConstructor<infer E> ? E : T

export type AvailableSlots = {
  $slots: {
    default: () => VNode[]
  }
}

export type ComponentProps<T extends DefinedComponent> = Omit<
  ExtractPropTypes<InstanceType<T>['$props']>,
  keyof VNodeProps | keyof AllowedComponentProps
>
