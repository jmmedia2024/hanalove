import { Client } from 'pg';

export interface HyperdriveEnv {
  DATABASE_URL: string;
}

/**
 * Creates a PostgreSQL client connected to Cloudflare Hyperdrive.
 * Hyperdrive provides connection pooling and caching.
 */
export function createHyperdriveClient(env: HyperdriveEnv): Client {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured for Hyperdrive');
  }

  return new Client({
    connectionString: env.DATABASE_URL,
    // Hyperdrive, Neon, and PlanetScale generally require SSL
    ssl: { rejectUnauthorized: false }
  });
}
