import { Link } from 'react-router-dom'
import Sidebar from "./Sidebar"

function NotFoundPage() {
    return (
        <>
        <Sidebar />
        <div>
            <h1>Not Found Page! ❌</h1>
        </div>
        <Link to="/">
            <button>Go Back Home</button>
        </Link>
        </>
    )
}

export default NotFoundPage