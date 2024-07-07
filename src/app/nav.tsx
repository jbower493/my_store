import Link from "next/link";

function NavItem({ children }: { children: JSX.Element }) {
    return (
        <div className="flex flex-1 justify-center items-center">
            {children}
        </div>
    );
}

export function Nav() {
    return (
        <div className="flex justify-center pt-4">
            <nav className="bg-white rounded-[50px] flex w-[400px] h-8">
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
        </div>
    );
}
