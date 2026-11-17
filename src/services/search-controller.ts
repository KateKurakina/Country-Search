export type SearchFn = (query: string, signal: AbortSignal) => Promise<string[]>;

export class SearchController {
  private abortController: AbortController | null = null;

  constructor(private readonly searchFn: SearchFn) {}

  async search(query: string): Promise<string[]> {
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
