import { useEffect, useState } from "react";
import { getAdminApplications } from "../../api/admin";
import StatusBadge from "../../components/StatusBadge";

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminApplications().then((r) => setApps(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">All Applications</h1>
      <p className="page-subtitle">{apps.length} total applications</p>

      {loading ? <div className="loading-state">Loading…</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Worker</th><th>Job</th><th>Status</th><th>Applied</th></tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>{a.worker?.first_name} {a.worker?.last_name}</td>
                  <td className="text-muted">{a.job?.title}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-muted">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
