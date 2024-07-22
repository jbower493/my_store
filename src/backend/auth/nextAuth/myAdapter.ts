import { openDb } from "@/backend/database/utils/connection";
import { runQuery } from "@/backend/database/utils/runQuery";
import {
    Adapter,
    AdapterAccount,
    AdapterSession,
    AdapterUser,
} from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";
import { Session, User } from "../types";

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
                throw insert.error.details;
            }

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where id = ?", [user.id])
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                throw new Error("User not found");
            }

            await db.close();

            return retrieve.result;
        },
        async getUser(id) {
            const db = await openDb();

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where id = ?", [Number(id)])
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                return null;
            }

            await db.close();

            return retrieve.result;
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
        async getUserByEmail(email) {
            const db = await openDb();

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where email = ?", [email])
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                return null;
            }

            await db.close();

            return retrieve.result;
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
                return null;
            }

            await db.close();

            return retrieved.result;
        },
        async updateUser(user) {
            const db = await openDb();

            const insert = await runQuery(() =>
                db.run(
                    "update User set email = ?, name = ?, image = ?, emailVerified = ? where id = ?",
                    [user.email, user.name, user.image, null, user.id]
                )
            );

            if (insert.error) {
                throw insert.error.details;
            }

            const retrieve = await runQuery(() =>
                db.get<User>("select * from User where id = ?", [user.id])
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                throw new Error("User not found");
            }

            await db.close();

            return retrieve.result;
        },
        async createSession(user) {
            const db = await openDb();

            const newSessionId = uuidv4();

            const insert = await runQuery(() =>
                db.run(
                    "insert into Session (id, expires, sessionToken, userId) values (?, ?, ?, ?)",
                    [
                        newSessionId,
                        user.expires.toISOString(),
                        user.sessionToken,
                        user.userId,
                    ]
                )
            );

            if (insert.error) {
                throw insert.error.details;
            }

            const retrieve = await runQuery(() =>
                db.get<Session>("select * from Session where id = ?", [
                    newSessionId,
                ])
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                throw new Error("Session not found");
            }

            await db.close();

            const newSession: typeof user = {
                ...retrieve.result,
                expires: new Date(retrieve.result.expires),
            };

            return newSession;
        },
        async getSessionAndUser(sessionToken) {
            const db = await openDb();

            type UserAndSession = User & Session;

            const retrieve = await runQuery(() =>
                db.get<UserAndSession>(
                    `
                    SELECT User.*, Session.*
                    FROM Session
                    INNER JOIN User
                    ON Session.userId = User.id
                    WHERE Session.sessionToken = ?
                `,
                    [sessionToken]
                )
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                return null;
            }

            await db.close();

            const userAndSession: {
                session: AdapterSession;
                user: AdapterUser;
            } | null = {
                user: {
                    id: retrieve.result.id,
                    email: retrieve.result.email,
                    emailVerified: retrieve.result.emailVerified,
                    image: retrieve.result.image,
                    name: retrieve.result.name,
                },
                session: {
                    expires: new Date(retrieve.result.expires),
                    sessionToken: retrieve.result.sessionToken,
                    userId: retrieve.result.userId,
                },
            };

            return userAndSession;
        },
        async updateSession(session) {
            const db = await openDb();

            const newExpires = session.expires?.toISOString();

            const insert = await runQuery(() =>
                db.run(
                    "update Session set expires = ?, userId = ? where sessionToken = ?",
                    [newExpires, session.userId, session.sessionToken]
                )
            );

            if (insert.error) {
                throw insert.error.details;
            }

            const retrieve = await runQuery(() =>
                db.get<Session>(
                    "select * from Session where sessionToken = ?",
                    [session.sessionToken]
                )
            );

            if (retrieve.error) {
                throw retrieve.error.details;
            }

            if (!retrieve.result) {
                return null;
            }

            await db.close();

            const foundSession: AdapterSession = {
                ...retrieve.result,
                expires: new Date(retrieve.result.expires),
            };

            return foundSession;
        },
        async deleteSession(sessionToken) {
            const db = await openDb();

            const deleted = await runQuery(() =>
                db.run("delete from Session where sessionToken = ?", [
                    sessionToken,
                ])
            );

            if (deleted.error) {
                throw deleted.error.details;
            }

            await db.close();

            return null;
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
// getUserByAccount();

async function updateUser() {
    const user: AdapterUser = {
        id: "1",
        name: "Bob Kenwright",
        email: "bob@bobkenners.com",
        image: "bobbkensy.jpg",
        emailVerified: null,
    };

    const updatedUser = await adapter.updateUser?.(user);
    console.log(updatedUser);
}
// updateUser();

async function createSession() {
    const session: AdapterSession = {
        expires: new Date("2024-07-28T15:30:00.000Z"),
        sessionToken: "oiuaelnawekfjasdfj",
        userId: "1",
    };

    const newSession = await adapter.createSession?.(session);
    console.log(newSession);
}
// createSession();

async function getSessionAndUser() {
    const sessionToken: AdapterSession["sessionToken"] = "oiuaelnawekfjasdfj";

    const sessionAndUser = await adapter.getSessionAndUser?.(sessionToken);
    console.log(sessionAndUser);
}
// getSessionAndUser();

async function updateSession() {
    const session: AdapterSession = {
        expires: new Date("2024-09-09T15:30:00.000Z"),
        sessionToken: "oiuaelnawekfjasdfj",
        userId: "1",
    };

    const updatedSession = await adapter.updateSession?.(session);
    console.log(updatedSession);
}
// updateSession();

async function deleteSession() {
    const sessionToken = "oiuaelnawekfjasdfj";

    await adapter.deleteSession?.(sessionToken);
    console.log("Session deleted");
}
// deleteSession();
