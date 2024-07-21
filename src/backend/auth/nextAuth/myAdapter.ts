import { openDb } from "@/backend/database/utils/connection";
import { runQuery } from "@/backend/database/utils/runQuery";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";
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
                throw insert.error.details;
            }

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where id = ?", [
                    insert.result.lastID,
                ])
            );

            if (retrieve.error) {
                // Do something other than this, look this up in the docs
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                throw new Error("User not found");
            }

            const newUser: AdapterUser = {
                ...retrieve.result,
                id: retrieve.result.id,
            };

            await db.close();

            return newUser;
        },
        async getUser(id) {
            const db = await openDb();

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where id = ?", [Number(id)])
            );

            if (retrieve.error) {
                // Do something other than this, look this up in the docs
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                throw new Error("User not found");
            }

            const newUser: AdapterUser = {
                ...retrieve.result,
                id: retrieve.result.id.toString(),
            };

            await db.close();

            return newUser;
        },
        async linkAccount(account) {
            const db = await openDb();

            const newAccountId = uuidv4();

            const insert = await runQuery(() =>
                db.run(
                    "insert into Account (id, userId, type, provider, providerAccountId, refresh_token,access_token, expires_at, token_type, scope, id_token) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        newAccountId,
                        account.userId,
                        account.type,
                        account.provider,
                        account.providerAccountId,
                        account.refresh_token,
                        account.access_token,
                        account.expires_at,
                        account.token_type,
                        account.scope,
                        account.id_token,
                    ]
                )
            );

            if (insert.error) {
                throw insert.error.details;
            }

            await db.close();

            return null;
        },
        async getUserByAccount(providerAccountId) {
            const db = await openDb();

            const retrieved = await runQuery(() =>
                db.get<User>(
                    `
                        SELECT User.*
                        FROM Account
                        INNER JOIN User
                        ON Account.userId = User.id
                        WHERE Account.provider = ? AND Account.providerAccountId = ?
                    `,
                    [
                        providerAccountId.provider,
                        providerAccountId.providerAccountId,
                    ]
                )
            );

            if (retrieved.error) {
                throw retrieved.error.details;
            }

            if (!retrieved.result) {
                throw new Error("User not found");
            }

            await db.close();

            return retrieved.result;
        },
    };
}

const adapter = MyAdapter();
async function createUser() {
    const user: AdapterUser = {
        id: "1",
        name: "Bob",
        email: "bob@bob.com",
        image: "bobby.jpg",
        emailVerified: null,
    };

    const newUser = await adapter.createUser?.(user);
    console.log(newUser);
}
// createUser();

async function getUser() {
    const id: AdapterUser["id"] = "2";

    const newUser = await adapter.getUser?.(id);
    console.log(newUser);
}
// getUser();

async function linkAccount() {
    const account: AdapterAccount = {
        provider: "my provider",
        providerAccountId: "123",
        type: "oidc",
        userId: "1",
        access_token: "access me",
        expires_at: 12345,
        id_token: "id token mate",
        refresh_token: "refrez",
        token_type: "bobs token",
        scope: "openid",
    };

    await adapter.linkAccount?.(account);
}
// linkAccount();

async function getUserByAccount() {
    const providerAccountId: Pick<
        AdapterAccount,
        "provider" | "providerAccountId"
    > = {
        provider: "my provider",
        providerAccountId: "123",
    };

    const gotUser = await adapter.getUserByAccount?.(providerAccountId);
    console.log(gotUser);
}
getUserByAccount();
