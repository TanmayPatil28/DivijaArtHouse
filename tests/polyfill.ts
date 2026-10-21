import { AsyncLocalStorage } from 'node:async_hooks';

if (!globalThis.AsyncLocalStorage) {
  (globalThis as any).AsyncLocalStorage = AsyncLocalStorage;
}
