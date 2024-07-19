import { openDb } from "../connection";
import { runQuery } from "../utils";

export async function select() {
    const db = await openDb();

    const { result, error } = await runQuery(() =>
        db.all(`SELECT * FROM users`)
    );

    if (!error) {
        console.log(result);
    } else {
        console.log(error);
    }

    return { result, error };
}

select();
