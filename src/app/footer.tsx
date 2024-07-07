function Column({ children }: { children: JSX.Element[] }) {
    return <div className="w-[150px]">{children}</div>;
}

function ColumnTitle({ children }: { children: string }) {
    return <h4 className="mb-3">{children}</h4>;
}

function ColumnItem({ children }: { children: string }) {
    return <p className="text-gray-500 text-sm">{children}</p>;
}

export function Footer() {
    return (
        <footer className="h-[250px] bg-slate-300 flex justify-center items-center px-28">
            <div className="flex gap-5 justify-between">
                <Column>
                    <ColumnTitle>Features</ColumnTitle>
                    <ColumnItem>Something</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                </Column>
                <Column>
                    <ColumnTitle>Blog</ColumnTitle>
                    <ColumnItem>Something</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                </Column>
                <Column>
                    <ColumnTitle>News</ColumnTitle>
                    <ColumnItem>Something</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                </Column>
                <Column>
                    <ColumnTitle>Contact</ColumnTitle>
                    <ColumnItem>Something</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                    <ColumnItem>Next one</ColumnItem>
                </Column>
            </div>
        </footer>
    );
}
