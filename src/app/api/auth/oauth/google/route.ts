import { NextResponse } from "next/server";

export async function GET() {
    function getSearchParams() {
        const GOOGLE_ID = process.env.GOOGLE_ID;

        const params = {
            client_id: GOOGLE_ID,
            redirect_uri: "http%3A//localhost:3000/api/auth/callback/google",
            response_type: "code",
            scope: "https%3A//www.googleapis.com/auth/drive.file",
        };

        return Object.entries(params)
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
