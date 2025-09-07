import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from "./components/NotFoundPage";
import Dashboard from "./components/Dashboard"
import DashboardItems from "./components/DashboardItems";
import Settings from "./components/Settings";
import Transactions from "./components/Transactions"
import About from "./components/About";
import Login from "./components/Login";
import Landing from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter([
  {path: "/", element: <Landing />},
  {path: "/app", element: <ProtectedRoute><App /></ProtectedRoute>},
  {path: "/login", element: <Login />},
  {path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
  {path: "/about", element: <ProtectedRoute><About /></ProtectedRoute>},
  {path: "/dashboard/:id", element: <ProtectedRoute><DashboardItems /></ProtectedRoute>},
  {path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute>},
  {path: "/transactions", element: <ProtectedRoute><Transactions /></ProtectedRoute>},
  {path: "*", element: <NotFoundPage />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
