/**
 * Retrieves the FINARK_API_KEY from the environment.
 * This function attempts to read from `process.env` (Node.js),
 * then `Deno.env.get` (Deno), and finally falls back to checking a global
 * variable `FINARK_API_KEY` that might be set in a browser environment (e.g., via a script tag).
 *
 * @returns The API key string if found, otherwise undefined.
 */
export const getApiKey = (): string | undefined => {
  // Check for Node.js environment
  if (typeof process !== "undefined" && process.env && process.env.FINARK_API_KEY) {
    return process.env.FINARK_API_KEY;
  }

  // Check for Deno environment
  // @ts-ignore: Deno specific API
  if (typeof Deno !== "undefined" && typeof Deno.env === "object" && typeof Deno.env.get === "function") {
    // @ts-ignore: Deno specific API
    return Deno.env.get("FINARK_API_KEY");
  }

  // Check for browser global variable (less secure, use with caution)
  // This allows setting window.FINARK_API_KEY or const FINARK_API_KEY;
  // @ts-ignore: Checking for globalThis or window
  const globalScope = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : undefined);
  if (globalScope && (globalScope as any).FINARK_API_KEY) {
    return (globalScope as any).FINARK_API_KEY;
  }

  return undefined;
};
