export type SearchFn<T> = (query: string, signal: AbortSignal) => Promise<T[]>;

export class SearchController<T = string> {
  private abortController: AbortController | null = null;

  constructor(private readonly searchFn: SearchFn<T>) {}

  async search(query: string): Promise<T[]> {
    if (this.abortController) {
      this.abortController.abort();
    }

    const currentController = new AbortController();
    this.abortController = currentController;

    try {
      const result = await this.searchFn(query, currentController.signal);

      if (currentController.signal.aborted) {
        return [];
      }

      return result;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return [];
      }

      throw error;
    }
  }
}
