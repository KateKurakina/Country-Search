import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchController } from '../src/services/search-controller';

describe('SearchController', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should abort the previous request when a new search starts', async () => {
    const search = vi.fn().mockImplementation(() => new Promise(() => {}));

    const controller = new SearchController(search);

    controller.search('Germany');
    const firstSignal = search.mock.calls[0][1] as AbortSignal;

    controller.search('France');

    expect(firstSignal.aborted).toBe(true);
    expect(search).toHaveBeenCalledTimes(2);
  });

  it('should not return results from an outdated request', async () => {
    let resolveFirst: (value: string[]) => void = () => {};
    let resolveSecond: (value: string[]) => void = () => {};

    const search = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<string[]>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<string[]>((resolve) => {
            resolveSecond = resolve;
          }),
      );

    const controller = new SearchController(search);

    const firstRequest = controller.search('Germany');
    const secondRequest = controller.search('France');

    resolveSecond(['France']);
    await expect(secondRequest).resolves.toEqual(['France']);

    resolveFirst(['Germany']);
    await expect(firstRequest).resolves.toEqual([]);
  });

  it('should silently handle AbortError', async () => {
    const abortError = new DOMException('Request aborted', 'AbortError');
    const search = vi.fn().mockRejectedValue(abortError);

    const controller = new SearchController(search);

    await expect(controller.search('Germany')).resolves.toEqual([]);
  });

  it('should reject when a request times out', async () => {
    const timeoutError = new DOMException('Request timed out', 'TimeoutError');
    const search = vi.fn().mockRejectedValue(timeoutError);

    const controller = new SearchController(search);

    await expect(controller.search('Germany')).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });

  it('should reject when a real error occurs', async () => {
    const error = new Error('Network error');
    const search = vi.fn().mockRejectedValue(error);

    const controller = new SearchController(search);

    await expect(controller.search('Germany')).rejects.toThrow('Network error');
  });
});
