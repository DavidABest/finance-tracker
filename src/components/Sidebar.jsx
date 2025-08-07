import React from 'react';
// import { IconName } from "react-icons/fa";
import { FaHome, FaMoneyCheckAlt, FaChartLine, FaCog } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0
        flex flex-col
        bg-gray-900 text-white shadow-lg">

      <h2>Finance Tracker</h2>
      <br></br>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <a href="#dashboard" className="text-red-950">
            <SideBarIcon icon={<FaHome size="28" />} text="Dashboard"/> 
          </a>
        </li>
        <li >
          <a href="#transactions">
            <SideBarIcon icon={<FaMoneyCheckAlt size="28" />} text="Transactions"/> 
          </a>
        </li>
        <li >
          <a href="#reports">
            <SideBarIcon icon={<FaChartLine size="28" />} ext="Reports"/> 
          </a>
        </li>
        <li c>
          <a href="#settings">
            <SideBarIcon icon={<FaChartLine size="28" />} text="Settings" /> 
          </a>
        </li>
      </ul>
    </div>
  );
}

const SideBarIcon = ({ icon, text = "tooltip 💡" }) => (
   <div className="sidebar-icon group">
    {icon}

    <span class="sidebar-tooltip group-hover:scale-100">
        {text}
    </span>
   </div>
    
);

export default Sidebar