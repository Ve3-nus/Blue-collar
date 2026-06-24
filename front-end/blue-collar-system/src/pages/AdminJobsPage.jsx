import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminJobs } from "../api/admin";
import StatusBadge from "../components/StatusBadge";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminJobs().then((r) => setJobs(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) =>
    `${j.title} ${j.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h1 className="page-title">All Jobs</h1>
      <p className="page-subtitle">{jobs.length} jobs on the platform</p>

      <div className="search-bar">
        <input className="field-input search-input" placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading-state">Loading…</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Customer</th><th>Location</th><th>Type</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id}>
                  <td>{j.title}</td>
                  <td className="text-muted">{j.customer?.first_name} {j.customer?.last_name}</td>
                  <td className="text-muted">{j.location}</td>
                  <td><span className="badge badge-gray">{j.job_type}</span></td>
                  <td><StatusBadge status={j.status} /></td>
                  <td><Link to={`/jobs/${j.id}`} className="btn btn-small btn-ghost">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
