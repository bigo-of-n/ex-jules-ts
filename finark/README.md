# Finark API Client

A TypeScript client for interacting with the Finark API. This client provides typed methods to access various endpoints related to mutual fund data, portfolio viewing, and analysis.

## Installation

This package is not yet published to npm. To use it locally, you can build it and then link it or copy the `dist` folder.

First, ensure you have Node.js and npm installed. Then, navigate to the `finark` directory:

```bash
cd finark
npm install # Installs dev dependencies like TypeScript
npm run build # Compiles TypeScript to JavaScript in the dist folder
```

## Usage

1.  **Set Environment Variable**:
    The API client requires an API key passed via the `FINARK_API_KEY` environment variable.
    ```bash
    export FINARK_API_KEY="your_actual_api_key"
    ```
    Alternatively, for browser environments where `process.env` is not available, you can set `window.FINARK_API_KEY = "your_actual_api_key";` before instantiating the client if the `getApiKey` utility is not modified.

2.  **Import and Initialize Client**:

    ```typescript
    import { ApiClient } from './dist/apiClient'; // Adjust path as necessary
    // or if using modules:
    // import { ApiClient } from 'finark-api-client'; // after publishing or linking

    const apiClient = new ApiClient("http://localhost:3000"); // Optional: override base URL

    // Example: Search for mutual funds
    async function searchFunds() {
      try {
        const searchTerm = "Mirae Arbit";
        const response = await apiClient.searchMutualFunds(searchTerm);
        console.log("Search Results:", response.data);
      } catch (error) {
        console.error("Error searching funds:", error);
      }
    }

    searchFunds();
    ```

## API Client Methods

The `ApiClient` class provides the following asynchronous methods:

*   `searchMutualFunds(searchTerm: string): Promise<MfSearchResponse>`
    Searches for mutual funds based on a search term.

*   `filterMutualFunds(params: MfFilterParams): Promise<MfFilterResponse>`
    Filters mutual funds based on specified criteria (`category`, `subCategory`, `fundName`, `risk`, `limit`).

*   `getMutualFundDetails(isin: string): Promise<MfDetailsResponse>`
    Retrieves detailed information for a specific mutual fund using its ISIN.

*   `getMutualFundNavHistory(isin: string): Promise<NavHistoryResponse>`
    Fetches the NAV (Net Asset Value) history for a mutual fund.

*   `getMutualFundHoldings(isin: string): Promise<HoldingsResponse>`
    Gets the current holdings for a specific mutual fund.

Refer to `src/types.ts` for detailed request parameter and response data structures.

## Development

*   Source files are in the `src` directory.
*   Types are defined in `src/types.ts`.
*   The API client logic is in `src/apiClient.ts`.
*   Utility functions (like API key retrieval) are in `src/utils.ts`.

To rebuild the project after making changes:

```bash
npm run build
```

This will output the compiled JavaScript and type declaration files to the `dist` directory.
