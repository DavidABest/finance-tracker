import Sidebar from "./Sidebar"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";

function DashboardItems() {
    const { id } = useParams();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`)
        .then((response) => response.json())
        .then((data) => setTodos(data))
        .catch((error) => console.error("Error fetching todos:", error));
    }, [id]);

    return (
        <>
        <Sidebar />
        <div>
            <h1>Dashboard Todos</h1>
            <ul>
                {todos.map((todo) => (
                    <div className="p-4">
                    <li key={todo.id}>
                        <h3>{todo.title}</h3>
                        <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
                    </li>
                    </div>
                ))}
            </ul>
        </div>
        
        </>
    )
}

export default DashboardItems