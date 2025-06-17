import fetch from 'node-fetch'; // Using node-fetch v2 syntax

const BASE_URL = 'https://api.finark.com/api/v1';
const API_KEY_ENV_VAR = 'FINARK_API_KEY';

function getApiKey(): string {
  const apiKey = process.env[API_KEY_ENV_VAR];
  if (!apiKey) {
    throw new Error(`API key not found. Please set the ${API_KEY_ENV_VAR} environment variable.`);
  }
  return apiKey;
}

interface RequestOptions {
  method?: string;
  // Add other relevant options like body, etc., if POST/PUT requests are needed later
}

// Placeholder for the actual response type, will be made generic later
type ApiResponse = any;

export async function makeRequest(path: string, options?: RequestOptions): Promise<ApiResponse> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };

  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: headers,
      // body: options?.body ? JSON.stringify(options.body) : undefined, // For POST/PUT
    });

    if (!response.ok) {
      // Try to get error details from response body
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON or already consumed
      }
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }

    // Assuming all successful responses are JSON for now
    return await response.json() as ApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during the API request.');
  }
}
