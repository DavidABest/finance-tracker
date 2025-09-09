import { Link } from 'react-router-dom'
// import { IconName } from "react-icons/fa";
import { FaHome, FaMoneyCheckAlt, FaCog, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../config/environment';

function Sidebar() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0
        flex flex-col
        bg-gray-900 text-white shadow-lg">

      <h2>Finance Tracker</h2>
      <br></br>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="flex-1">
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
      
      <div className="mb-4">
        <button onClick={handleLogout} className="w-full !bg-transparent !border-0 !p-0 appearance-none focus:outline-none !shadow-none">
          <SideBarIcon icon={<FaSignOutAlt size="28" />} text="Logout" />
        </button>
      </div>
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