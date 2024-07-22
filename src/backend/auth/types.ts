export interface User {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: Date | null;
}

export interface Account {
    provider: string;
    providerAccountId: string;
    type: string;
    userId: string;
    access_token?: string;
    expires_at?: number;
    id_token?: string;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
}

export interface Session {
    id: string;
    expires: string;
    sessionToken: string;
    userId: string;
}
