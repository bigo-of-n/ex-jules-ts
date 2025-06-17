import { makeRequest } from './core';
import {
  MutualFundSearchResponse,
  MutualFundCategoriesResponse,
  FilterMutualFundsResponse,
  MutualFundDetailResponse,
  // Import specific item types if needed for return values, e.g. MutualFundSearchResultItem
} from './types';

const BASE_PATH = '/mfs';

/**
 * Fetches Mutual Funds by Search Term or Last Index.
 * Corresponds to: GET /api/v1/mfs?searchTerm=Mirae arbit
 *                GET /api/v1/mfs?searchTerm=Mirae
 */
export async function searchMutualFunds(
  searchTerm?: string,
  // lastIndex?: string, // The API doc implies searchTerm OR lastIndex, but not how lastIndex is used.
                       // For now, focusing on searchTerm based on clear examples.
                       // If lastIndex is a pagination cursor, the API needs to be clear on its usage.
): Promise<MutualFundSearchResponse> {
  const queryParams = new URLSearchParams();
  if (searchTerm) {
    queryParams.append('searchTerm', searchTerm);
  }
  // if (lastIndex) { // Logic for lastIndex if its usage becomes clear
  //   queryParams.append('lastIndex', lastIndex);
  // }

  const path = `${BASE_PATH}?${queryParams.toString()}`;
  return makeRequest(path) as Promise<MutualFundSearchResponse>;
}

/**
 * Gets all Mutual Fund Categories.
 * Corresponds to: GET /api/v1/mfs/categories
 */
export async function getMutualFundCategories(): Promise<MutualFundCategoriesResponse> {
  const path = `${BASE_PATH}/categories`;
  // Assuming the response directly matches MutualFundCategoriesResponse including a 'data' field.
  return makeRequest(path) as Promise<MutualFundCategoriesResponse>;
}

/**
 * Filters Mutual Funds by Category, SubCategory, Limit, and Offset.
 * Corresponds to: GET /api/v1/mfs/filter?category=Equity%20Scheme&subCategory=ELSS&limit=3&offset=3
 */
export async function filterMutualFunds(
  category: string,
  subCategory?: string,
  limit?: number,
  offset?: number,
): Promise<FilterMutualFundsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('category', category);
  if (subCategory) {
    queryParams.append('subCategory', subCategory);
  }
  if (limit !== undefined) {
    queryParams.append('limit', limit.toString());
  }
  if (offset !== undefined) {
    queryParams.append('offset', offset.toString());
  }

  const path = `${BASE_PATH}/filter?${queryParams.toString()}`;
  // Assuming the response directly matches FilterMutualFundsResponse including a 'data' field.
  return makeRequest(path) as Promise<FilterMutualFundsResponse>;
}

/**
 * Fetches Mutual Fund Details by ISIN.
 * Corresponds to: GET /api/v1/mfs/INF769K01036
 */
export async function getMutualFundDetails(isin: string): Promise<MutualFundDetailResponse> {
  if (!isin) {
    throw new Error('ISIN is required to fetch mutual fund details.');
  }
  const path = `${BASE_PATH}/${isin}`;
  // Assuming the response directly matches MutualFundDetailResponse including a 'data' field.
  return makeRequest(path) as Promise<MutualFundDetailResponse>;
}

// It might also be good to re-export types from here for easier library usage
export * from './types';
