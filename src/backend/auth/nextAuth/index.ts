import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { DataSourceOptions } from "typeorm";
import * as entities from "./entities";

const connection: DataSourceOptions = {
    type: "sqlite",
    database: "../../database/database.db",
};

// @ts-ignore
const typeOrmAdapter = TypeORMAdapter(connection, { entities: entities });

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub, Google],
    adapter: typeOrmAdapter,
});
