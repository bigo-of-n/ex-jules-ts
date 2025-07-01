import { handle } from '@hono/node-adapter/lambda';
import app from './app.js'; // Note the .js extension for compiled output

// The 'handle' function from @hono/node-adapter/lambda converts
// API Gateway events (e.g., HTTP requests) into a format Hono understands,
// allowing your Hono application to process them as standard web requests.
// It then converts Hono's response back to API Gateway's expected format,
// ensuring seamless integration without requiring manual event parsing or response formatting
// within your core Hono logic. This makes your Hono app highly portable.
export const handler = handle(app);
