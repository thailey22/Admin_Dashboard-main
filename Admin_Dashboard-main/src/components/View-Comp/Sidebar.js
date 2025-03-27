// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { MdDashboard } from "react-icons/md";
import { MdOutlineLocalParking } from "react-icons/md";
import { FaBarsProgress } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = ({isCollapsed, toggleSidebar}) => {
  

  return (
    
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '☰' : '✖'}
      </button>
      <ul>
        <li>
          <Link to="/dashboard">
            <span className="icon"><MdDashboard /></span> <span className="text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/parking-spaces">
            <span className="icon"><MdOutlineLocalParking /></span> <span className="text">Parking Spaces</span>
          </Link>
        </li>
        <li>
          <Link to="/reservations">
            <span className="icon"><FaBarsProgress /></span> <span className="text">Reservations</span>
          </Link>
        </li>
        <li>
          <Link to="/users">
            <span className="icon"><FaUsers /></span> <span className="text">Users</span>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <span className="icon"><GoReport /></span> <span className="text">Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <span className="icon"><IoSettingsOutline /></span> <span className="text">Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;