import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'data', 'db.json');

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
