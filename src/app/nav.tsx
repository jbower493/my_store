import Link from "next/link";

async function UserProfile() {
    return (
        <div className="bg-white h-8 rounded-[50px] flex gap-5 items-center px-5">
            Hello {false || "Guest"}
            {false ? (
                <Link href="/api/auth/signout">Logout</Link>
            ) : (
                <Link href="/login">Login</Link>
            )}
        </div>
    );
}

function NavItem({ children }: { children: JSX.Element }) {
    return (
        <div className="flex flex-1 justify-center items-center">
            {children}
        </div>
    );
}

export function Nav() {
    return (
        <div className="flex justify-between pt-4 px-5">
            <nav className="bg-white rounded-[50px] flex w-[300px] h-8">
                <NavItem>
                    <Link className="text-black" href="/">
                        Home
                    </Link>
                </NavItem>
                <NavItem>
                    <Link className="text-black" href="/">
                        About
                    </Link>
                </NavItem>
                <NavItem>
                    <Link className="text-black" href="/shop">
                        Shop
                    </Link>
                </NavItem>
                <NavItem>
                    <Link className="text-black" href="/">
                        Contact
                    </Link>
                </NavItem>
            </nav>
            <UserProfile />
        </div>
    );
}
