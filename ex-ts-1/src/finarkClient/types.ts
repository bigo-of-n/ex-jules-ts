// Types for GET /mfs?searchTerm=...
export interface MutualFundSearchResultItem {
  fund_name: string;
  isin: string;
  category_amfi: string;
}

export interface MutualFundSearchResponse {
  data: MutualFundSearchResultItem[];
}

// Types for GET /mfs/:isin
export interface Riskometer {
  at_launch: string;
  as_on_date: string;
}

export interface Benchmarks {
  tier_1: string;
  tier_2: string; // Or null, depending on actual data
}

export interface FundManagers {
  fund_manager_names: string;
  fund_manager_types: string;
  fund_manager_from_dates: string;
}

export interface TopHolding {
  isin: string; // Note: example had "N/A", so string is appropriate
  name: string;
  perc_to_nav: number;
  industry_or_rating: string;
}

// Simplified structure for returns, can be expanded if needed
export interface ReturnDetail {
  date: string;
  nav: number;
}

export interface NYearReturn {
  date: string;
  nav: number;
}

export interface YearsReturn {
  [period: string]: NYearReturn & { cagr?: number }; // e.g., "2_years", "3_years"
}

export interface MetaReturns {
  latest: ReturnDetail;
  "1_month": ReturnDetail;
  "3_months": ReturnDetail;
  "6_months": ReturnDetail;
  "1_year": ReturnDetail;
  "2_years": { two_years: NYearReturn; cagr: number };
  "3_years": { three_years: NYearReturn; cagr: number };
  "5_years": { five_years: NYearReturn; cagr: number };
  "7_years": { seven_years: NYearReturn; cagr: number };
  // Add other periods if necessary
}


export interface MutualFundDetailData {
  mf_scheme_id: string;
  factsheet_id: number; // Assuming number, example was "1511"
  fund_name: string;
  nav_name: string;
  category_amfi: string;
  category: string;
  description: string;
  isin: string;
  aum_in_lakhs: string; // Example "9344088.57", keep as string or convert to number? String is safer.
  expense_ratios: string;
  exit_load: string;
  riskometer: Riskometer;
  benchmarks: Benchmarks;
  fund_managers: FundManagers;
  launch_date: string; // Example "13-May-2013"
  close_date: string;  // Example "21-May-2013"
  top_holdings: TopHolding[];
  meta: {
    returns: MetaReturns;
  };
}

export interface MutualFundDetailResponse {
  data: MutualFundDetailData;
}

// Placeholder types for Categories API
export interface Category {
  id: string; // Example, adjust as needed
  name: string; // Example, adjust as needed
  // Add other properties based on actual API response
}

export interface MutualFundCategoriesResponse {
  data: Category[]; // Assuming it's an array of category objects
}

// Placeholder types for Filter API
// This will likely be similar to MutualFundSearchResultItem or a variation
export interface FilteredMutualFund {
  fund_name: string;
  isin: string;
  category_amfi: string;
  // Add other properties specific to filter results
}

export interface FilterMutualFundsResponse {
  data: FilteredMutualFund[]; // Assuming it's an array
}

// Generic API response type to be used by makeRequest if needed,
// or functions can use specific response types.
export type FinarkApiResponse =
  | MutualFundSearchResponse
  | MutualFundDetailResponse
  | MutualFundCategoriesResponse
  | FilterMutualFundsResponse;
