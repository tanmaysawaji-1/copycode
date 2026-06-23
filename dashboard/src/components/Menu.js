import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Holdings", path: "/holdings" },
  { label: "Positions", path: "/positions" },
  { label: "WatchList",path:"/userwatch"},
  { label: "Funds", path: "/funds" }
  
];

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const Menu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = getCookie("username") || "User";
  const mobile = getCookie("mobile") || "";
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mobile=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = process.env.REACT_APP_FRONTEND_URL || "https://your-vercel-frontend-url.vercel.app";
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div 
        className="avatar" 
        style={{ cursor: "pointer" }} 
        onClick={() => setIsSidebarOpen(true)}
      >
        {username.slice(0, 2).toUpperCase()}
      </div>

      {isSidebarOpen && (
        <div className="user-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="user-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="user-sidebar-header">
              <div className="user-info-sidebar">
                <div className="avatar" style={{ marginLeft: 0 }}>
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{username}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{mobile}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#999" }}
              >
                ✕
              </button>
            </div>

            <div className="user-sidebar-content">
              <div className="sidebar-menu-item">My Profile</div>
              <div className="sidebar-menu-item">Settings</div>
              <div className="sidebar-menu-item">Support</div>
              
              <div className="sidebar-menu-item logout-btn" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;