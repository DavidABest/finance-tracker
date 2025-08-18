import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from "./components/NotFoundPage.jsx";
import Dashboard from "./components/Dashboard.jsx"
import DashboardItems from "./components/DashboardItems.jsx";
import Settings from "./components/Settings.jsx";
import Reports from "./components/Reports.jsx";
import Transactions from "./components/Transactions.jsx"
import About from "./components/About.jsx";

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/about", element: <About />},
  {path: "/dashboard/:id", element: <DashboardItems />},
  {path: "/settings", element: <Settings />},
  {path: "/reports", element: <Reports />},
  {path: "/transactions", element: <Transactions />},
  {path: "*", element: <NotFoundPage />},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
