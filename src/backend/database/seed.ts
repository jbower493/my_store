import { openDb } from "./connection";

async function seed() {
    const db = await openDb();

    await db.run(`
        CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            image TEXT
            emailVerified TEXT
        )
    `);
}

seed();
