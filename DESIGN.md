# Country Search — Design Document

## 1. Project Architecture

The application is divided into separate modules, each responsible for a specific task.

| File                                | Responsibility                                              |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/app.ts`                        | Application entry point and UI logic                        |
| `src/services/countries-api.ts`     | Fetches country data from the API and handles HTTP errors   |
| `src/services/search-controller.ts` | Manages search requests, cancellation, and outdated results |
| `src/utils/debounce.ts`             | Delays function execution until the user stops typing       |
| `src/utils/map-country-response.ts` | Transforms API responses into the application data format   |
| `src/types/country.ts`              | Defines the Country interface                               |

The architecture separates API communication, data transformation, request management, and UI logic. This makes individual modules easier to test and maintain.

## 2. Request Cancellation and Race Conditions

The application uses `AbortController` to cancel previous search requests when a new search starts.

Each request gets its own `AbortController`. Before starting a new request, the previous controller is aborted.

This approach helps avoid unnecessary network activity and prevents outdated requests from being treated as current.

However, cancellation alone is not sufficient. A request may resolve even after it has been aborted, especially when working with mocked functions or asynchronous operations that do not respect the abort signal.

To prevent outdated results from being returned, the controller checks whether the request's signal has been aborted after the response is received.

```typescript
const result = await this.searchFn(query, currentController.signal);

if (currentController.signal.aborted) {
  return [];
}
```

This combines request cancellation with an additional stale-result check.

`AbortError` caused by user cancellation is handled silently. Other errors are propagated to the caller.

## 3. Debounce

The application uses a custom `debounce` utility to avoid sending a request after every keystroke.

The function delays execution until the specified period has passed without another call.

A delay of approximately 500 milliseconds is a reasonable starting point for search input: it reduces unnecessary API requests while keeping the interface responsive.

The delay is configurable, so it can be adjusted if needed.

The debounce utility also passes the latest arguments to the callback.

## 4. Timeout Handling

API requests have a timeout of 10 seconds.

`AbortSignal.timeout()` creates a signal that is automatically aborted when the timeout expires.

`AbortSignal.any()` combines the timeout signal with the signal used for manual request cancellation.

This allows the request to be stopped either when the user starts a new search or when the server takes too long to respond.

The application distinguishes between:

- `AbortError` — the request was cancelled because a new search started;
- `TimeoutError` — the request exceeded the allowed time.

User cancellation is handled silently, while timeout errors are propagated so the UI can display an appropriate message.

## 5. API Error Handling

The `searchCountries` function handles API responses as follows:

- Successful response — returns country data.
- HTTP 404 — returns an empty array because no matching countries were found.
- Other
