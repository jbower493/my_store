import { cloneElement } from "react";

export function Button({
    children,
    sm,
    className,
}: {
    children: JSX.Element;
    sm?: boolean;
    className?: string;
}) {
    return cloneElement(children, {
        className: `rounded-[50px] ${
            sm ? "h-7 w-28" : "h-10 w-36"
        } bg-black text-white flex justify-center items-center${
            className ? " " + className : ""
        }`,
    });
}
