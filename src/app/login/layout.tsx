export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full pt-24">
            <div className="bg-white rounded-t-3xl h-full p-8">{children}</div>
        </div>
    );
}
