import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: "Total Users", value: stats.total_users ?? "—" },
    { label: "Total Jobs", value: stats.total_jobs ?? "—" },
    { label: "Applications", value: stats.total_applications ?? "—" },
    { label: "Completion Rate", value: stats.completion_rate ? `${stats.completion_rate}%` : "—" },
  ] : Array(4).fill({ label: "Loading…", value: "…" });

  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Platform overview and controls</p>

      <div className="stats-row">
        {cards.map((c, i) => (
          <div key={i} className="stat-card">
            <span className="stat-value">{c.value}</span>
            <span className="stat-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-nav-grid">
        {[
          { to: "/admin/users", label: "Manage Users", icon: "👥", desc: "View, suspend, or activate accounts" },
          { to: "/admin/jobs", label: "All Jobs", icon: "💼", desc: "Browse every job on the platform" },
          { to: "/admin/applications", label: "Applications", icon: "📋", desc: "Monitor application activity" },
          { to: "/admin/reviews", label: "Reviews", icon: "⭐", desc: "Moderate worker reviews" },
          { to: "/analytics", label: "Analytics", icon: "📊", desc: "Top skills, workers, and trends" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="admin-nav-card">
            <span className="admin-nav-icon">{item.icon}</span>
            <div>
              <div className="admin-nav-label">{item.label}</div>
              <div className="admin-nav-desc">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
