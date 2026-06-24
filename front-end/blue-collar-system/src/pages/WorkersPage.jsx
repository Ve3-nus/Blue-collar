import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkers } from "../api/workers";

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getWorkers().then((r) => setWorkers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = workers.filter((w) =>
    `${w.user?.first_name} ${w.user?.last_name} ${w.skills?.join(" ")}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h1 className="page-title">Workers</h1>
      <p className="page-subtitle">Browse available skilled workers</p>

      <div className="search-bar">
        <input className="field-input search-input" placeholder="Search by name or skill…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading-state">Loading…</div> : (
        <div className="jobs-grid">
          {filtered.map((w) => (
            <Link to={`/workers/${w.id}`} key={w.id} className="job-card">
              <div className="worker-avatar-sm">{w.user?.first_name?.charAt(0)}</div>
              <h3 className="job-card-title">{w.user?.first_name} {w.user?.last_name}</h3>
              <p className="job-card-desc">{w.bio?.slice(0, 100) || "No bio"}</p>
              <div className="job-card-footer">
                {w.average_rating && <span>⭐ {Number(w.average_rating).toFixed(1)}</span>}
                {w.location && <span>📍 {w.location}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


