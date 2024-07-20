import { oauth2Client } from "@/backend/containers/auth/oauthClient";
import { NextRequest, NextResponse } from "next/server";
import { URL, URLSearchParams } from "node:url";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const error = searchParams.get("error");
    const code = searchParams.get("code") || "";
    const state = searchParams.get("state"); // TODO: store the state from the first oath request in the session, then check against it in this request

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: "Something went wrong",
        });
    }

    const getTokenResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(getTokenResponse.tokens);

    return NextResponse.redirect("http://localhost:3000");
}
