export function helloWorld(): string {
  return "Hello World";
}

// Export FinArk client functions and types
export * as FinArkClient from './finarkClient';
// This makes types available like FinArkClient.MutualFundDetailResponse etc.
// And functions like FinArkClient.searchMutualFunds(...)
