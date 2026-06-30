import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

// `prepare: false` is required for Supabase's transaction-mode pooler
// (port 6543 / PgBouncer), which does not support prepared statements.
const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle(client, { schema });
