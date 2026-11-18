type DebouncedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> => {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunction = (...args: Args): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = undefined;
      fn(...args);
    }, delay);
  };

  debouncedFunction.cancel = (): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
  };

  return debouncedFunction;
};
