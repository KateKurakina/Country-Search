import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCountries, HttpError } from '../src/services/countries-api';

describe('searchCountries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return countries when the request is successful', async () => {
    const countries = [{ name: 'Germany' }];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(countries),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCountries('Germany', new AbortController().signal);

    expect(result).toEqual(countries);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://countries.dev/name/Germany',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('should return an empty array when the response status is 404', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCountries('Unknown', new AbortController().signal);

    expect(result).toEqual([]);
  });

  it('should throw HttpError when the response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    vi.stubGlobal('fetch', fetchMock);

    const request = searchCountries('Germany', new AbortController().signal);

    await expect(request).rejects.toThrow(HttpError);
    await expect(request).rejects.toMatchObject({
      status: 500,
    });
  });
});
