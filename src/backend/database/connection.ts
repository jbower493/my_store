import { verbose } from "sqlite3";
import { open } from "sqlite";

const sqlite3 = verbose();

export async function openDb() {
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database,
    });

    return db;
}
