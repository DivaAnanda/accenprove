import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

/**
 * SQLite Database Connection
 * File: sqlite.db (created automatically)
 */
const sqlite = new Database("sqlite.db");

// Enable foreign keys (important for cascade deletes)
sqlite.pragma("foreign_keys = ON");

// Enable WAL mode for better concurrency
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

export default db;
