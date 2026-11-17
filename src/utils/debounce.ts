export const debounce = (fn: (...args: unknown[]) => void, delay: number): ((...args: unknown[]) => void) => {
  void fn;
  void delay;
  return (...args: unknown[]): void => {
    void args;
  };
};
