import { ComponentConstructor } from 'quasar'
import { VNode } from 'vue'

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
