import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

// `prepare: false` is required behind transaction-mode poolers (PgBouncer),
// which do not support prepared statements.
//
// GCP Cloud SQL can be reached over a unix socket. postgres.js only treats
// the host as a socket path when it is passed via the options object with a
// leading '/', so a `?host=/cloudsql/...` query parameter in POSTGRES_URL is
// translated here instead of being handed to the URL parser (which would
// silently fall back to localhost:5432).
function createClient() {
  const raw = process.env.POSTGRES_URL;
  if (!raw) {
    throw new Error('POSTGRES_URL is not set');
  }

  const url = new URL(raw);
  const socketHost = url.searchParams.get('host');

  if (socketHost?.startsWith('/')) {
    return postgres({
      host: socketHost,
      database: url.pathname.replace(/^\//, ''),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      prepare: false,
    });
  }

  return postgres(raw, { prepare: false });
}

const client = createClient();
export const db = drizzle(client, { schema });
