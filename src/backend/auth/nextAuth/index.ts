import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { MyAdapter } from "./myAdapter";

// Adapter
const myAdapter = MyAdapter();

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub, Google],
    adapter: myAdapter,
});
