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

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/about", element: <About />},
  {path: "/dashboard/:id", element: <DashboardItems />},
  {path: "/settings", element: <Settings />},
  {path: "/transactions", element: <Transactions />},
  {path: "*", element: <NotFoundPage />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
