import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../api/jobs";
import StatusBadge from "../components/StatusBadge";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getJobs()
      .then((r) => setJobs(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">{jobs.length} jobs available on the platform</p>
        </div>
        <Link to="/jobs/new" className="btn btn-primary">+ Post a Job</Link>
      </div>

      <div className="search-bar">
        <input
          className="field-input search-input"
          placeholder="Search by title or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading jobs…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No jobs match your search.</p></div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-card-title">{job.title}</h3>
                <StatusBadge status={job.status} />
              </div>
              <p className="job-card-desc">{job.description?.slice(0, 120)}…</p>
              <div className="job-card-footer">
                <span>📍 {job.location || "Remote"}</span>
                <span>🏷 {job.job_type}</span>
                {job.budget && <span>💰 KES {job.budget}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
