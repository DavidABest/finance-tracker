import Sidebar from "./Sidebar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
// import { lazy, Suspense } from 'react';

function Dashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const dashboardItems = [
        {id: 1, title: "My Profile"},
        {id: 2, title: "My Projects"},
        {id: 3, title: "My Teams"},
    ]

    return (
        <>
        <Sidebar />
        <div>
            <h1>User Dashboard</h1>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/dashboard/${user.id}`}>
                            <h2>{user.name}</h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default Dashboard