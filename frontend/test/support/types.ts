import { VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'

export type WrappedVueComponent<T = unknown> = VueWrapper<ComponentPublicInstance & T>

export interface ModelValueProperty { modelValue: unknown }
