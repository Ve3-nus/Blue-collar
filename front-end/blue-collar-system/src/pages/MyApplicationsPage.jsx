import { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyApplications, getApplications, updateApplication } from "../api/applications";
import { AuthContext } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function MyApplicationsPage() {
  const { user } = useContext(AuthContext);
  const isCustomer = user?.role === "customer";

  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // customers → fan-out across all their jobs' applicants
      // workers   → /my_applications
      const data = isCustomer ? await getApplications() : await getMyApplications();
      setApps(Array.isArray(data) ? data : data.data || []);
    } catch {
      setError("Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => { if (user) load(); }, [user, load]);

  const handleUpdate = async (id, status) => {
    try {
      await updateApplication(id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch {
      setError("Failed to update application.");
    }
  };

  /* ── helpers ── */
  const workerName = (app) =>
    [app.worker?.first_name, app.worker?.last_name].filter(Boolean).join(" ") || "Worker";

  const jobTitle = (app) => app.job?.title || "Untitled job";

  const postedBy = (app) =>
    app.job?.customer?.first_name || app.job?.user?.first_name || "Customer";

  const appliedDate = (app) =>
    app.created_at ? new Date(app.created_at).toLocaleDateString() : "—";

  return (
    <div className="dashboard">
      <h1 className="page-title">
        {isCustomer ? "Incoming Applications" : "My Applications"}
      </h1>
      <p className="page-subtitle">
        {isCustomer
          ? "Review and respond to worker applications across all your jobs."
          : "Track every job you have applied to."}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <p>{isCustomer ? "No applications received yet." : "You haven't applied to any jobs yet."}</p>
          {!isCustomer && (
            <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
          )}
        </div>
      ) : (
        <div className="card-list">
          {apps.map((app) => (
            <div key={app.id} className="list-card">
              <div className="list-card-body">
                <div className="list-card-title">
                  {isCustomer ? workerName(app) : jobTitle(app)}
                </div>
                <div className="list-card-meta">
                  <span className="list-card-meta-row">
                    {isCustomer
                      ? `For: ${jobTitle(app)}`
                      : `Posted by: ${postedBy(app)}`}
                    {" · "}Applied {appliedDate(app)}
                  </span>
                </div>

                {/* Customer: accept / reject pending applications */}
                {isCustomer && app.status === "pending" && (
                  <div className="action-row" style={{ marginTop: "0.5rem" }}>
                    <button
                      className="btn btn-small btn-success"
                      onClick={() => handleUpdate(app.id, "accepted")}
                    >
                      ✓ Accept
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleUpdate(app.id, "rejected")}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="list-card-actions">
                <StatusBadge status={app.status} />
                {!isCustomer && (
                  <Link
                    to={`/jobs/${app.job?.id}`}
                    className="btn btn-secondary btn-small"
                  >
                    View Job
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
