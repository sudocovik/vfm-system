import { VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'

export type Properties = Record<string, unknown>

export type VueComponent = unknown

export type WrappedVueComponent<T = unknown> = VueWrapper<ComponentPublicInstance & T>

export interface ModelValueProperty { modelValue: unknown }

export interface TypeProperty { type?: unknown }

export interface LabelProperty { label?: unknown }

export interface LoadingProperty { loading?: boolean }

export interface DisableProperty { disabled?: boolean }

export interface ErrorMessageProperty { errorMessage?: string }
