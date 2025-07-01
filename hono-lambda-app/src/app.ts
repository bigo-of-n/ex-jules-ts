import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { createClient, Client } from '@libsql/client'; // Turso client
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'; // Drizzle ORM for Turso
import { navData, NavDataItem } from './db/schema.js'; // Drizzle schema and types
import { eq, desc } from 'drizzle-orm';
import type { Context } from 'hono'; // Import Hono Context type

const app = new Hono();

// Global variable for the Drizzle DB instance.
let db: LibSQLDatabase | null = null;

/**
 * Retrieves a secret from AWS Secrets Manager.
 * @param {string} secretName - The name or ARN of the secret to retrieve.
 * @returns {Promise<object>} The parsed secret data, typically a JSON object.
 * @throws {Error} If the secret cannot be retrieved or parsed.
 */
async function getSecret(secretName: string): Promise<Record<string, string>> {
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-south-1' });
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const data = await client.send(command);
        if ('SecretString' in data && data.SecretString) {
            return JSON.parse(data.SecretString) as Record<string, string>;
        }
        throw new Error('SecretString not found or empty in response from Secrets Manager.');
    } catch (error) {
        console.error('Error retrieving secret:', error);
        throw error;
    }
}

/**
 * Initializes the Turso database connection and Drizzle ORM instance.
 * This function is designed to be idempotent; it only initializes the connection if it doesn't already exist.
 * @returns {Promise<LibSQLDatabase>} The Drizzle DB instance connected to Turso.
 * @throws {Error} If Turso credentials are missing or the connection fails.
 */
async function initializeDatabase(): Promise<LibSQLDatabase> {
    if (db) return db;

    try {
        const tursoSecrets = await getSecret(process.env.SECRETS_MANAGER_SECRET_NAME || 'TursoCredentials');
        const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = tursoSecrets;

        if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
            throw new Error('Turso database URL or auth token missing in secret. Cannot establish connection.');
        }

        const tursoClient: Client = createClient({
            url: TURSO_DATABASE_URL,
            authToken: TURSO_AUTH_TOKEN,
        });

        db = drizzle(tursoClient);
        console.log('Turso database connection and Drizzle initialized successfully.');
        return db;
    } catch (error) {
        console.error('Failed to initialize Turso database:', error);
        throw new Error(`Turso database initialization failed: ${(error as Error).message}`);
    }
}

// Middleware to ensure the database is initialized for every request.
app.use(async (c: Context, next) {
    try {
        if (!db) {
            await initializeDatabase();
        }
        // Hono's Context can be extended to include custom properties.
        // For simplicity, we're using `c.set` which is dynamically typed.
        // For stricter typing, you might define a custom Hono Env interface.
        c.set('db', db);
        await next();
    } catch (error) {
        return c.json({ error: (error as Error).message, message: 'Database connection error' }, 500);
    }
});

// Serve static files (optional, for local development/testing).
app.use('/static/*', serveStatic({ root: './', path: './static' }));

// Root endpoint for basic health check.
app.get('/', async (c: Context) => {
    return c.text('Hello Hono with Turso! Your API is up and running.');
});

// GET /v1/mfs/{ISIN}/nav - Get NAV data for a specific ISIN.
app.get('/v1/mfs/:isin/nav', async (c: Context) => {
    const dbInstance: LibSQLDatabase = c.get('db');
    const isin: string = c.req.param('isin');

    try {
        const results: NavDataItem[] = await dbInstance.select()
                                        .from(navData)
                                        .where(eq(navData.isin, isin))
                                        .orderBy(desc(navData.date));
        if (results.length > 0) {
            return c.json(results);
        }
        return c.json({ message: `NAV data not found for ISIN: ${isin}` }, 404);
    } catch (error) {
        console.error(`Error fetching NAV data for ISIN ${isin}:`, error);
        return c.json({ error: `Failed to fetch NAV data for ISIN ${isin}`, details: (error as Error).message }, 500);
    }
});

// GET /v1/mfs/{ISIN}/meta - Get metadata (e.g., latest NAV) for a specific ISIN.
app.get('/v1/mfs/:isin/meta', async (c: Context) => {
    const dbInstance: LibSQLDatabase = c.get('db');
    const isin: string = c.req.param('isin');

    try {
        const latestNav: NavDataItem[] = await dbInstance.select()
                                          .from(navData)
                                          .where(eq(navData.isin, isin))
                                          .orderBy(desc(navData.date))
                                          .limit(1);

        if (latestNav.length > 0) {
            const { date, nav, code } = latestNav[0];
            return c.json({
                isin: isin,
                latestNav: nav,
                latestNavDate: date,
                code: code
            });
        }
        return c.json({ message: `Metadata not found for ISIN: ${isin}` }, 404);
    } catch (error) {
        console.error(`Error fetching metadata for ISIN ${isin}:`, error);
        return c.json({ error: `Failed to fetch metadata for ISIN ${isin}`, details: (error as Error).message }, 500);
    }
});

export default app;
