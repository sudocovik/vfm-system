import { ComponentConstructor } from 'quasar'

export * from './ComponentUnderTest'
export * from './InputField'
export * from './Button'
export * from './inAllLanguages'
export * from './Event'
export * from './Random'
export * from './getComponentKey'

export type QuasarComponentPublicApi<T> = T extends ComponentConstructor<infer E> ? E : T
