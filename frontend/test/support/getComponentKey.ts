import { VueWrapper } from '@vue/test-utils'

type VmOptions = {
  $: {
    vnode: {
      key: number
    }
  }
}

export function getComponentKey (component: VueWrapper) {
  return (<VmOptions>component.vm).$.vnode.key
}
