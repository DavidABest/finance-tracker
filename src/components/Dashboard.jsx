import Sidebar from "./Sidebar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
// import { lazy, Suspense } from 'react';

function Dashboard() {


    const dashboardItems = [
        {id: 1, title: "My Profile"},
        {id: 2, title: "My Projects"},
        {id: 3, title: "My Teams"},
    ]

    return (
        <>
        <Sidebar />
        <div>
            <h1>This is now a blank user dashboard. Add some cards and stuff.</h1>
        </div>
        </>
    )
}

export default Dashboard