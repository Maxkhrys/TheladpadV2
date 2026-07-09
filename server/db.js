import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Override with DB_PATH when mounting a persistent volume (e.g. on Railway,
// whose default filesystem is wiped on every redeploy).
const file = process.env.DB_PATH || path.join(__dirname, 'data', 'db.json');

const defaultData = {
  users: [],
  services: [],
  bookings: [],
  locations: [],
};

const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDB() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  for (const key of Object.keys(defaultData)) {
    db.data[key] ||= [];
  }
  await db.write();
  return db;
}

export async function persist() {
  await db.write();
}
