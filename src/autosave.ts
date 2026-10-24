/** Coalesces frequent canvas changes; serializes writes to preserve their order. */
export function createAutosave<T>(write: (value: T) => Promise<unknown>, onError: (error: unknown) => void, delay = 200) {
  let pending: { value: T } | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let chain = Promise.resolve();
  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    if (pending) {
      const { value } = pending;
      pending = undefined;
      chain = chain.then(() => write(value)).then(() => {}, onError);
    }
    return chain;
  };
  return {
    schedule(value: T) {
      pending = { value };
      // Throttle, rather than debounce: continuous drawing also gets saved.
      timer ??= setTimeout(flush, delay);
    },
    flush,
  };
}
