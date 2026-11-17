export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP error: ${status}`);
    this.name = 'HttpError';
  }
}

export const searchCountries = async (query: string, signal: AbortSignal): Promise<unknown[]> => {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;

  const timeoutSignal = AbortSignal.timeout(10000);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const response = await fetch(url, { signal: combinedSignal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<unknown[]>;
};
