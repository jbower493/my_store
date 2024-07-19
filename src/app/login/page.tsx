"use client";

export default function Login() {
    async function loginWithGoogle() {
        try {
            const res = await fetch(
                "http://localhost:3000/api/auth/oauth/google"
            );

            if (!res.ok) {
                throw new Error("Fetch failed");
            }

            const data = await res.json();

            console.log(data);

            window.location.href = data.redirect_url;
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <div className="flex gap-8">
                <button type="button" onClick={loginWithGoogle}>
                    Login with Google
                </button>
            </div>
        </div>
    );
}
