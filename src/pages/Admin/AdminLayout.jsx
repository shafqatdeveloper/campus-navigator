import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUsers,
  FiHome,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: FiHome, end: true },
    { path: "/admin/teachers", label: "Manage Teachers", icon: FiUsers },
    { path: "/admin/rooms", label: "Manage Rooms", icon: FiHome },
    { path: "/admin/timetable", label: "Manage Timetable", icon: FiCalendar },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "A";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            {sidebarOpen && <span>Admin Portal</span>}
          </h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="user-info">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-details">
              <p>{user.email}</p>
              <span>Administrator</span>
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`admin-main ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
