import { openDb } from "@/backend/database/connection";
import { runQuery } from "@/backend/database/utils";
import { User } from "./types";

export async function getAllUsers() {
    const db = await openDb();

    const { result, error } = await runQuery(() =>
        db.all<User[]>(`SELECT * FROM users`)
    );

    return { result, error };
}
