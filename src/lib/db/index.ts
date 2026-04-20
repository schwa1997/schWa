import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type DB = ReturnType<typeof drizzle>

declare global {
  // eslint-disable-next-line no-var
  var _db: DB | undefined
}

export function getDb(): DB {
  if (!globalThis._db) {
    const client = postgres(process.env.DATABASE_URL!, { prepare: false })
    globalThis._db = drizzle(client, { schema })
  }
  return globalThis._db
}

export const db = new Proxy({} as DB, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
