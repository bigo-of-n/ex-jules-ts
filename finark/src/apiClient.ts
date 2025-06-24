import {
  MfSearchResponse,
  MfFilterParams,
  MfFilterResponse,
  MfDetailsResponse,
  NavHistoryResponse,
  HoldingsResponse,
  MfSearchItem,
  MfFilterItem,
  MfDetailsData,
  ApiErrorResponse,
  TopHolding,
  HoldingItem,
} from "./types";
import { getApiKey } from "./utils";

// Helper function to safely parse string to float, returning null on failure or if input is null/undefined
const safeParseFloat = (value: string | null | undefined): number | null => {
  if (value === null || value === undefined || value.trim() === "") {
    return null;
  }
  const number = parseFloat(value);
  return isNaN(number) ? null : number;
};

// Helper to transform raw MfSearchItem from API (string numbers to actual numbers)
const transformMfSearchItem = (raw: any): MfSearchItem => ({
  ...raw,
  aum: safeParseFloat(raw.aum),
});

// Helper to transform raw MfFilterItem
const transformMfFilterItem = (raw: any): MfFilterItem => ({
  ...raw,
  aum: safeParseFloat(raw.aum),
  lastNavDate: raw.lastNavDate === "" ? null : raw.lastNavDate,
});

// Helper to transform raw TopHolding
const transformTopHolding = (raw: any): TopHolding => ({
  ...raw,
  // perc_to_nav is already a number in the provided sample, but good to ensure
  perc_to_nav: typeof raw.perc_to_nav === 'string' ? safeParseFloat(raw.perc_to_nav) : raw.perc_to_nav,
});

// Helper to transform raw HoldingItem
const transformHoldingItem = (raw: any): HoldingItem => ({
  ...raw,
   // perc_to_nav is already a number in the provided sample
  perc_to_nav: typeof raw.perc_to_nav === 'string' ? safeParseFloat(raw.perc_to_nav) : raw.perc_to_nav,
});

// Helper to transform raw MfDetailsData
const transformMfDetailsData = (raw: any): MfDetailsData => ({
  ...raw,
  factsheet_id: typeof raw.factsheet_id === 'string' ? parseInt(raw.factsheet_id, 10) : raw.factsheet_id,
  aum_in_lakhs: safeParseFloat(raw.aum_in_lakhs),
  top_holdings: raw.top_holdings?.map(transformTopHolding) || null,
  // meta and other nested structures are assumed to have correct types or handled by consumer
  // For returns, nav values are already numbers in sample.
});


export class ApiClient {
  private baseUrl: string;
  private apiKey: string | undefined;
  private additionalHeaders: Record<string, string>;

  constructor(
    baseUrl: string = "http://localhost:3000",
    additionalHeaders: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = getApiKey();
    this.additionalHeaders = additionalHeaders;

    if (!this.apiKey) {
      console.warn(
        "FINARK_API_KEY not found in environment. API calls may fail."
      );
    }
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.additionalHeaders,
    };

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errorData: ApiErrorResponse | string = await response.text();
        try {
          errorData = JSON.parse(errorData as string) as ApiErrorResponse;
        } catch (e) {
          // Keep errorData as text if it's not valid JSON
        }
        throw {
          status: response.status,
          message: typeof errorData === 'string' ? errorData : (errorData.message || errorData.error || `HTTP error ${response.status}`),
          data: errorData,
        };
      }
      // Handle cases where response might be empty (e.g., 204 No Content)
      const responseText = await response.text();
      if (!responseText) {
        return null as T; // Or handle as appropriate for your API design
      }
      return JSON.parse(responseText) as T;
    } catch (error) {
      // Log or transform error as needed before re-throwing
      // console.error(`API Request Error (${method} ${url}):`, error);
      throw error;
    }
  }

  async searchMutualFunds(searchTerm: string): Promise<MfSearchResponse> {
    const rawResponse = await this.request<any>(`/mfs?searchTerm=${encodeURIComponent(searchTerm)}`);
    return {
      ...rawResponse,
      data: rawResponse.data?.map(transformMfSearchItem) || [],
    };
  }

  async filterMutualFunds(params: MfFilterParams): Promise<MfFilterResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const rawResponse = await this.request<any>(`/mfs/filter?${queryParams.toString()}`);
    return {
      ...rawResponse,
      data: rawResponse.data?.map(transformMfFilterItem) || [],
    };
  }

  async getMutualFundDetails(isin: string): Promise<MfDetailsResponse> {
    const rawResponse = await this.request<any>(`/mfs/${isin}`);
    return {
      ...rawResponse,
      data: rawResponse.data ? transformMfDetailsData(rawResponse.data) : null,
    };
  }

  async getMutualFundNavHistory(isin: string): Promise<NavHistoryResponse> {
    // NAV history data items (date, nav) seem to have correct types in sample
    return this.request<NavHistoryResponse>(`/mfs/${isin}/nav`);
  }

  async getMutualFundHoldings(isin: string): Promise<HoldingsResponse> {
    const rawResponse = await this.request<any>(`/mfs/${isin}/holdings`);
    return {
      ...rawResponse,
      data: rawResponse.data?.map(transformHoldingItem) || [],
    };
  }
}
