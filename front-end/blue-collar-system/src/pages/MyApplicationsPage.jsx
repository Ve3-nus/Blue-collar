import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyApplications, getApplications, updateApplication } from "../api/applications";
import { AuthContext } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function MyApplicationsPage() {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const fn = user?.role === "customer" ? getApplications : getMyApplications;
    fn().then((r) => setApps(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const handleUpdate = async (id, status) => {
    try {
      await updateApplication(id, status);
      setApps(apps.map((a) => a.id === id ? { ...a, status } : a));
    } catch {}
  };

  return (
    <div className="dashboard">
      <h1 className="page-title">{user?.role === "customer" ? "Incoming Applications" : "My Applications"}</h1>
      <p className="page-subtitle">
        {user?.role === "customer" ? "Review and respond to worker applications." : "Track all your job applications."}
      </p>

      {loading ? <div className="loading-state">Loading…</div> :
       apps.length === 0 ? (
        <div className="empty-state"><p>No applications found.</p></div>
      ) : (
        <div className="card-list">
          {apps.map((app) => (
            <div key={app.id} className="list-card">
              <div className="list-card-main">
                <span className="list-card-title">
                  {user?.role === "customer"
                    ? `${app.worker?.first_name} ${app.worker?.last_name}`
                    : app.job?.title}
                </span>
                <StatusBadge status={app.status} />
              </div>
              <span className="list-card-meta">
                {user?.role === "customer"
                  ? `For: ${app.job?.title}`
                  : `Posted by: ${app.job?.customer?.first_name}`}
                {" · "}Applied {new Date(app.created_at).toLocaleDateString()}
              </span>
              {user?.role === "customer" && app.status === "pending" && (
                <div className="action-row">
                  <button className="btn btn-small btn-success" onClick={() => handleUpdate(app.id, "accepted")}>Accept</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleUpdate(app.id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
