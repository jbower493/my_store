import { openDb } from "@/backend/database/connection";
import { runQuery } from "@/backend/database/utils/runQuery";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { User } from "../types";

export function MyAdapter(): Adapter {
    return {
        async createUser(user) {
            const db = await openDb();

            const insert = await runQuery(() =>
                db.run(
                    "insert into User (id, email, name, image, emailVerified) values (?, ?, ?, ?, ?)",
                    [user.id, user.email, user.name, user.image, null]
                )
            );

            if (insert.error) {
                // Do something other than this, look this up in the docs
                return user;
            }

            const retrieve = await runQuery<User | undefined>(() =>
                db.get("select * from User where id = ?", [
                    insert.result.lastID,
                ])
            );

            if (retrieve.error || !retrieve.result) {
                // Do something other than this, look this up in the docs
                return user;
            }

            const newUser: AdapterUser = {
                ...retrieve.result,
                id: retrieve.result.id.toString(),
            };

            return newUser;
        },
    };
}

const adapter = MyAdapter();
async function mate() {
    const newUser = await adapter.createUser?.({
        id: "2",
        name: "Bob",
        email: "bob@bob.com",
        image: "bobby.jpg",
        emailVerified: null,
    });

    console.log(newUser);
}
// mate();
