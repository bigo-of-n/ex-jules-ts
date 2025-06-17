# ex-ts-1

This project is a simple TypeScript example that includes a "Hello World" function.

It is set up using pnpm and includes basic TypeScript and Jest configurations.

## FinArk API Client Library

This project now includes a client library for interacting with the FinArk API (hosted at `api.finark.com`).

### Setup

1.  **Install Dependencies**: If you haven't already, install project dependencies:
    ```bash
    pnpm install
    ```
2.  **Set API Key**: The client requires the FinArk API key to be set as an environment variable named `FINARK_API_KEY`.
    ```bash
    export FINARK_API_KEY="your_actual_api_key_here"
    ```

### Usage Example

Here's how to import and use the client functions:

```typescript
import { FinArkClient } from './dist'; // Assuming you've built the project

async function main() {
  // Ensure FINARK_API_KEY is set in your environment

  try {
    // Search for mutual funds
    console.log("Searching for 'Parag' funds...");
    const searchResults = await FinArkClient.searchMutualFunds('Parag');
    console.log('Search Results:', JSON.stringify(searchResults.data.slice(0, 2), null, 2)); // Log first 2 results

    // Get fund details by ISIN (using an ISIN from the search example)
    if (searchResults.data.length > 0) {
      const firstIsin = searchResults.data[0].isin;
      console.log(`
Fetching details for ISIN: ${firstIsin}...`);
      const fundDetails = await FinArkClient.getMutualFundDetails(firstIsin);
      console.log('Fund Details:', JSON.stringify(fundDetails.data.fund_name, null, 2));
    }

    // Get categories (example - structure might be placeholder)
    // console.log('
Fetching categories...');
    // const categories = await FinArkClient.getMutualFundCategories();
    // console.log('Categories:', categories.data.slice(0, 2));

    // Filter funds (example - structure might be placeholder)
    // console.log('
Filtering for Equity Schemes...');
    // const filteredFunds = await FinArkClient.filterMutualFunds('Equity Scheme');
    // console.log('Filtered Funds:', filteredFunds.data.slice(0, 2));

  } catch (error) {
    console.error('Error using FinArkClient:', error);
  }
}

main();

// To run this example (after building):
// 1. Save it as example.ts in the project root.
// 2. Compile: tsc example.ts --outDir dist_example --module commonjs --esModuleInterop true --target es2022 --skipLibCheck true (adjust tsconfig as needed or use project build)
// 3. Run: FINARK_API_KEY="your_key" node dist_example/example.js
```

This client helps you interact with the following FinArk API endpoints:
- Search Mutual Funds (`/mfs?searchTerm=...`)
- Get Mutual Fund Categories (`/mfs/categories`)
- Filter Mutual Funds (`/mfs/filter?category=...`)
- Get Mutual Fund Details by ISIN (`/mfs/:isin`)
