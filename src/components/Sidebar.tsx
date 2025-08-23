import { Link } from 'react-router-dom'
// import { IconName } from "react-icons/fa";
import { FaHome, FaMoneyCheckAlt, FaChartLine, FaCog, FaInfoCircle } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0
        flex flex-col
        bg-gray-900 text-white shadow-lg">

      <h2>Finance Tracker</h2>
      <br></br>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <Link to="/dashboard" className="text-red-950">
            <SideBarIcon icon={<FaHome size="28" />} text="Dashboard"/> 
          </Link>
        </li>
        <li >
          <Link to="/transactions">
            <SideBarIcon icon={<FaMoneyCheckAlt size="28" />} text="Transactions"/> 
          </Link>
        </li>
        <li >
          <Link to="/reports">
            <SideBarIcon icon={<FaChartLine size="28" />} text="Reports"/> 
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <SideBarIcon icon={<FaCog size="28" />} text="Settings" /> 
          </Link>
        </li>
        <li>
          <Link to="/about">
            <SideBarIcon icon={<FaInfoCircle size="28" />} text="About" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

const SideBarIcon = ({ icon, text = "tooltip 💡" }: { icon: React.ReactElement; text?: string }) => (
   <div className="sidebar-icon group">
    {icon}

    <span className="sidebar-tooltip group-hover:scale-100">
        {text}
    </span>
   </div>
    
);

export default Sidebar