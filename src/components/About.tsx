import { Link } from 'react-router-dom'
import Sidebar from "./Sidebar"
import Comparison from "./Comparison"

function About() {
    return (
        <>
        <Sidebar />
        <h1 className="mb-10">This is a personal app made by David Best</h1>
        <h2>
        The story, all names, characters, credits portrayed in this fake data are fictitious. 
            No identification with actual persons (living or deceased), credits, debts, and life style is intended or should be inferred.
        </h2>
        <Comparison />
        </>
    )
}

export default About