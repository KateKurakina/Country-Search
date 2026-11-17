export class HttpError extends Error {}

export const searchCountries = async (query: string, signal: AbortSignal): Promise<unknown[]> => {
  void query;
  void signal;
  return [];
};
