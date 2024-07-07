import { Button } from "@/components/Button";
import Link from "next/link";

export default function Home() {
    return (
        <main className="pt-[350px]">
            <h1 className="text-[70px] font-extrabold text-center">
                Run, Sleep, Repeat
            </h1>
            <p className="text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod
            </p>
            <Button className="mx-auto mt-6">
                <Link href="/shop">Shop Now</Link>
            </Button>
        </main>
    );
}
