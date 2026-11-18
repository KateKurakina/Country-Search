import { afterEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../src/utils/debounce';

describe('debounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call the function after the specified delay', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const delay = 500;
    const debouncedCallback = debounce(callback, delay);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer when called again before the delay expires', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const delay = 500;
    const debouncedCallback = debounce(callback, delay);

    debouncedCallback();

    vi.advanceTimersByTime(300);
    debouncedCallback();

    vi.advanceTimersByTime(300);

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass the latest arguments to the function', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const delay = 500;
    const debouncedCallback = debounce(callback, delay);

    debouncedCallback('first');
    debouncedCallback('second');

    vi.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should cancel the pending function call', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const delay = 500;
    const debouncedCallback = debounce(callback, delay);

    debouncedCallback();
    debouncedCallback.cancel();

    vi.advanceTimersByTime(delay);

    expect(callback).not.toHaveBeenCalled();
  });
});
