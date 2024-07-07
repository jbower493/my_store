import { openDb } from "../connection";

async function insert() {
    const db = await openDb();

    const insertUserResult = await db.run(
        `
        INSERT INTO users
        (name, email)
        VALUES (?, ?)
    `,
        ["Rio Kenwright", "rio@rio.com"]
    );
}

insert();
