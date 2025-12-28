import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_t1ZSCiYNk8Kb@ep-tiny-pond-a1iutdyk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(DATABASE_URL);

// Helper function for dynamic SQL queries with Neon
export async function executeSql<T = unknown>(
  query: string,
  params: (string | number | null | boolean)[] = []
): Promise<T[]> {
  return sql.query(query, params) as Promise<T[]>;
}
