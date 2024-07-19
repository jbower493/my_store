import { getAllUsers } from "@/backend/containers/users/queries";

export default async function Test() {
    const { result, error } = await getAllUsers();

    if (error) {
        return <div>Error</div>;
    }

    return (
        <div>
            <h1>Users</h1>
            <div>
                {result?.map((user) => (
                    <p key={user.id}>{user.name}</p>
                ))}
            </div>
        </div>
    );
}
