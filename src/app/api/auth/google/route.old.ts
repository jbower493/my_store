import { NextResponse } from "next/server";

export async function GET() {
    function getSearchParams() {
        const GOOGLE_ID = process.env.GOOGLE_ID;

        const params = {
            client_id: GOOGLE_ID,
            redirect_uri:
                "http%3A%2F%2Flocalhost:3000%2Fapi%2Fauth%2Fcallback%2Fgoogle",
            response_type: "code",
            scope: "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid",
            // prompt: "select_account%20consent",
            prompt: "consent",
        };

        //accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline

        https: return Object.entries(params)
            .map(([key, val]) => {
                return `${key}=${val}`;
            })
            .join("&");
    }

    const url =
        "https://accounts.google.com/o/oauth2/v2/auth?" + getSearchParams();

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Fetch failed");
        }

        return NextResponse.json({
            success: true,
            redirect_url: res.url,
        });
    } catch (e) {
        return NextResponse.json({ success: false });
    }
}
