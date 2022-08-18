import { ServiceWorkerUpdated } from 'src/support/pwa/event-detail'

interface CustomEventMap {
  'service-worker-updated': CustomEvent<ServiceWorkerUpdated>;
}

// Copied from https://stackoverflow.com/a/68783088/5462427
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void

    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
  }
}

export { } // keep that to TS compiler.
