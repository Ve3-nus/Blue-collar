 import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const NAV_LINKS = {
  customer: [
    { to: "/dashboard", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/my-jobs", label: "My Jobs" },
    { to: "/applications", label: "Applications" },
    { to: "/notifications", label: "Notifications" },
  ],
  worker: [
    { to: "/dashboard", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/applications", label: "My Applications" },
    { to: "/worker-profile", label: "My Profile" },
    { to: "/notifications", label: "Notifications" },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/jobs", label: "Jobs" },
    { to: "/admin/applications", label: "Applications" },
    { to: "/admin/reviews", label: "Reviews" },
    { to: "/admin/stats", label: "Stats" },
  ],
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const links = NAV_LINKS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚒</span>
        <span className="brand-name">WorkMatch</span>
        <span className="brand-role">{user?.role}</span>
      </div>
      <nav className="navbar-links">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end={l.to === "/dashboard"}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="navbar-user">
        <span className="user-name">{user?.first_name} {user?.last_name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>Sign out</button>
      </div>
    </header>
  );
}