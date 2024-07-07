import { openDb } from "../connection";
import { runQuery } from "../utils";

async function select() {
    const db = await openDb();

    const { result, error } = await runQuery(() =>
        db.all(`SELECT * FROM users`)
    );

    if (!error) {
        console.log(result);
    } else {
        console.log(error);
    }
}

select();
