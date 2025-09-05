import { Link } from 'react-router-dom'
import Sidebar from "./Sidebar"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function NotFoundPage() {
    return (
        <>
        <Sidebar />
        <div className="ml-20 p-6 min-h-screen flex items-center justify-center bg-white dark:bg-[#1e2124]">
            <Card className="w-full max-w-md text-center border-none shadow-none">
                <CardHeader>
                    <div className="text-6xl mb-4">404</div>
                    <CardTitle className="text-2xl mb-2">Page Not Found</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <Link to="/dashboard" className="block">
                            <Button className="w-full">
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link to="/transactions" className="block">
                            <Button variant="outline" className="w-full">
                                View Transactions
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        </>
    )
}

export default NotFoundPage