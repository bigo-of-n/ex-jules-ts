// Represents the possible risk levels for a mutual fund.
export type RiskLevel =
  | "very_high_risk"
  | "high_risk"
  | "moderate_risk"
  | "low_risk"
  | "uncategorized" // Assuming 'null' from API means it's uncategorized or not available
  | null;

// Interface for a single mutual fund item returned by the search endpoint.
export interface MfSearchItem {
  fund_name: string;
  isin: string;
  category_amfi: string;
  risk: RiskLevel;
  aum: number | null; // Represented as string in JSON, will be parsed to number
}

// Interface for the response of the mutual fund search endpoint.
export interface MfSearchResponse {
  data: MfSearchItem[];
}

// Interface for the query parameters of the mutual fund filter endpoint.
export interface MfFilterParams {
  category?: string;
  subCategory?: string;
  fundName?: string;
  risk?: RiskLevel;
  limit?: number;
}

// Interface for a single mutual fund item returned by the filter endpoint.
export interface MfFilterItem {
  id: string;
  amc: string;
  code: string; // Added based on example
  name: string;
  type: string;
  category: string;
  navName: string;
  minAmount: string;
  launchDate: string; // Date format "DD-MMM-YYYY"
  closeDate: string; // Date format "DD-MMM-YYYY"
  isinDivPayout: string; // This is ISIN for dividend payout/reinvestment or growth
  lastNavDate: string | null; // Example shows "" which can be null
  schemeType: string;
  schemeSubType: string;
  aum: number | null; // Represented as string in JSON, will be parsed to number
  risk: RiskLevel;
}

// Interface for the response of the mutual fund filter endpoint.
export interface MfFilterResponse {
  data: MfFilterItem[];
}

// Interface for a top holding of a mutual fund.
export interface TopHolding {
  isin: string;
  name: string;
  perc_to_nav: number; // Represented as number in JSON
  industry_or_rating: string | null;
}

// Interface for the riskometer details of a mutual fund.
export interface Riskometer {
  at_launch: RiskLevel | null;
  as_on_date: RiskLevel | null;
}

// Interface for the benchmark details of a mutual fund.
export interface Benchmarks {
  tier_1: string | null;
  tier_2: string | null;
}

// Interface for the fund manager details of a mutual fund.
// Assuming these are single strings; if multiple, parsing might be needed by consumer.
export interface FundManagerDetails {
  fund_manager_names: string | null;
  fund_manager_types: string | null; // e.g., "Primary"
  fund_manager_from_dates: string | null; // e.g., "January 31, 2019"
}

// Interface for a NAV (Net Asset Value) data point with date.
export interface ReturnDataPoint {
  date: string; // Date format "YYYY-MM-DD"
  nav: number;
}

// Interface for simple return periods (e.g., latest, 1_month).
export interface ReturnPeriodSimple {
  date: string;
  nav: number;
}

// Interface for compounded return periods (e.g., 2_years, 3_years).
// The key for the nested period data (e.g., "two_years") matches the outer key.
export interface ReturnPeriodCompound {
  [periodKey: string]: ReturnDataPoint; // e.g., "two_years": { date: "...", nav: ... }
  cagr: number;
}

// Interface for the structure of returns meta data.
// Using mapped types might be complex due to different structures (simple vs compound).
// Explicitly listing known keys for better type safety.
export interface ReturnsMeta {
  latest?: ReturnPeriodSimple;
  "1_month"?: ReturnPeriodSimple;
  "3_months"?: ReturnPeriodSimple;
  "6_months"?: ReturnPeriodSimple;
  "1_year"?: ReturnPeriodSimple;
  "2_years"?: { two_years: ReturnDataPoint; cagr: number };
  "3_years"?: { three_years: ReturnDataPoint; cagr: number };
  "5_years"?: { five_years: ReturnDataPoint; cagr: number };
  "7_years"?: { seven_years: ReturnDataPoint; cagr: number };
  // Add other periods if they exist and follow a pattern
}

// Interface for the detailed data of a mutual fund.
export interface MfDetailsData {
  mf_scheme_id: string;
  factsheet_id: number; // Assuming number based on example "753"
  fund_name: string;
  nav_name: string;
  category_amfi: string;
  category: string;
  description: string;
  isin: string;
  aum_in_lakhs: number | null; // Represented as string in JSON, will be parsed
  expense_ratios: string | null; // e.g., "Regular 1.52, Direct 0.55"
  exit_load: string | null;
  riskometer: Riskometer | null;
  benchmarks: Benchmarks | null;
  fund_managers: FundManagerDetails | null; // Example shows singular, could be multiple formatted in string
  launch_date: string; // Date format "DD-MMM-YYYY"
  close_date: string; // Date format "DD-MMM-YYYY"
  top_holdings: TopHolding[] | null;
  meta: {
    returns: ReturnsMeta | null;
  } | null;
}

// Interface for the response of the mutual fund details endpoint.
export interface MfDetailsResponse {
  data: MfDetailsData;
}

// Interface for a NAV history item.
export interface NavHistoryItem {
  date: string; // Date format "YYYY-MM-DD"
  nav: number;
}

// Interface for the response of the NAV history endpoint.
export interface NavHistoryResponse {
  isin: string;
  data: NavHistoryItem[];
}

// Interface for a holding item of a mutual fund.
export interface HoldingItem {
  name: string;
  isin: string;
  industry_or_Rating: string | null; // Mapped from industry_or_rating
  perc_to_nav: number; // Represented as number in JSON
}

// Interface for the response of the holdings endpoint.
export interface HoldingsResponse {
  isin: string;
  data: HoldingItem[];
}

// General API error response structure (assumption, adjust if known)
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  // other potential error fields
}
