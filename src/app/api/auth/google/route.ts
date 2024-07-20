import { oauth2Client } from "@/backend/containers/auth/oauthClient";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET() {
    try {
        // Access scopes for read-only Drive activity.
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "openid",
        ];

        // Generate a secure random state value.
        const state = crypto.randomBytes(32).toString("hex");

        // Generate a url that asks permissions for the Drive activity scope
        const authorizationUrl = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: "offline",
            /** Pass in the scopes array defined above.
             * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
            scope: scopes,
            // Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes: true,
            // Include the state parameter to reduce the risk of CSRF attacks.
            state: state,
        });

        return NextResponse.json({
            success: true,
            redirect_url: authorizationUrl,
        });
    } catch (e) {
        return NextResponse.json({ success: false });
    }
}
