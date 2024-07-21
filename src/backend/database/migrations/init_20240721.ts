import { openDb } from "../utils/connection";

async function migrate() {
    const db = await openDb();

    await db.run(`
        CREATE TABLE IF NOT EXISTS User (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            image TEXT,
            emailVerified TEXT
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS Account (
            id TEXT PRIMARY KEY,
            userId TEXT,
            type TEXT,
            provider TEXT,
            providerAccountId TEXT,
            refresh_token TEXT,
            access_token INTEGER,
            expires_at TEXT,
            token_type TEXT,
            scope TEXT,
            id_token TEXT,
            FOREIGN KEY (userId) references User(id)
        )    
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS Session (
            id TEXT PRIMARY KEY,
            expires TEXT,
            sessionToken TEXT,
            userId TEXT,
            foreign key (userId) references User(id)
        )  
    `);
}

migrate();
