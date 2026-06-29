import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyJobs } from "../api/jobs";
import { getWorkers } from "../api/workers";
import { AuthContext } from "../context/AuthContext";

// Route: /jobs/new  (adjust if your route differs)

/* ── helpers ──────────────────────────────────────── */
function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function renderStars(rating = 0) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/* ── status badge ─────────────────────────────────── */
const STATUS_STYLE = {
  pending:   { bg: "#fff3cd", color: "#856404" },
  accepted:  { bg: "#d4edda", color: "#155724" },
  completed: { bg: "#e2e8f0", color: "#475569" },
  rejected:  { bg: "#f8d7da", color: "#721c24" },
};

function JobStatusBadge({ status }) {
  const s = STATUS_STYLE[status?.toLowerCase()] || { bg: "#e2e8f0", color: "#475569" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "0.22rem 0.75rem", borderRadius: 20,
      fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  );
}

/* ── avatar colour pool ───────────────────────────── */
const AVATAR_COLORS = [
  { bg: "#b8c8d8", color: "#1a2744" },
  { bg: "#c8d8e8", color: "#1a2744" },
  { bg: "#d8c8d8", color: "#1a2744" },
  { bg: "#c8e8d8", color: "#1a5740" },
  { bg: "#e8d8c8", color: "#5a3010" },
];

/* ══════════════════════════════════════════════════════
   CUSTOMER DASHBOARD
   ══════════════════════════════════════════════════════ */
export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const goPostJob = () => navigate("/jobs/new");

  const [jobs, setJobs]       = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyJobs().then((r) => setJobs(r.data || [])).catch(() => {}),
      getWorkers().then((r) => setWorkers(r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  /* ── derived stats ── */
  const jobsPosted  = jobs.length;
  const inProgress  = jobs.filter((j) => j.status === "accepted").length;
  const completed   = jobs.filter((j) => j.status === "completed").length;
  const avgRating   = user?.average_rating ?? "—";

  /* ── recent 3 jobs ── */
  const recentJobs  = [...jobs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  /* ── recommended workers (top 3) ── */
  const recommended = [...workers]
    .sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0))
    .slice(0, 3);

  /* ── search handler ── */
  const handleSearch = () => {
    if (search.trim()) navigate(`/workers?q=${encodeURIComponent(search.trim())}`);
    else navigate("/workers");
  };

  return (
    <div className="cd-wrapper">

      {/* ── Search hero ── */}
      <div className="cd-search-hero">
        <input
          className="cd-search-input"
          placeholder="Search for a worker or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="cd-search-btn" onClick={handleSearch}>Search</button>
      </div>

      <div className="cd-content">

        {/* ── Stats row ── */}
        <div className="cd-stats-row">
          <div className="cd-stat cd-stat-blue">
            <span className="cd-stat-label">Jobs Posted</span>
            <span className="cd-stat-value">{loading ? "…" : jobsPosted}</span>
          </div>
          <div className="cd-stat cd-stat-green">
            <span className="cd-stat-label">In Progress</span>
            <span className="cd-stat-value">{loading ? "…" : inProgress}</span>
          </div>
          <div className="cd-stat cd-stat-green">
            <span className="cd-stat-label">Completed</span>
            <span className="cd-stat-value">{loading ? "…" : completed}</span>
          </div>
          <div className="cd-stat cd-stat-amber">
            <span className="cd-stat-label">Avg Rating</span>
            <span className="cd-stat-value">
              {loading ? "…" : avgRating}
              {!loading && <span className="cd-star"> ★</span>}
            </span>
          </div>
        </div>

        {/* ── Recent Job Requests ── */}
        <section className="cd-section">
          <div className="cd-section-header">
            <h2 className="cd-section-title">Recent Job Requests</h2>
            <button className="cd-btn-primary" onClick={goPostJob}>+ Post New Job</button>
          </div>

          {loading ? (
            <div className="cd-loading">Loading jobs…</div>
          ) : recentJobs.length === 0 ? (
            <div className="cd-empty">
              <p>No jobs yet.</p>
              <button className="cd-btn-primary" onClick={goPostJob}>Post your first job</button>
            </div>
          ) : (
            <div className="cd-job-list">
              {recentJobs.map((job) => {
                const isCompleted = job.status === "completed";
                return (
                  <div key={job.id} className="cd-job-card">
                    <div className="cd-job-info">
                      <div className="cd-job-title">{job.title}</div>
                      <div className="cd-job-meta">
                        <span className="cd-meta-dot" />
                        {[job.location, job.job_type, timeAgo(job.created_at)]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="cd-job-actions">
                      {isCompleted ? (
                        <Link
                          to={`/jobs/${job.id}`}
                          className="cd-btn-review"
                        >
                          Leave Review
                        </Link>
                      ) : (
                        <Link
                          to={`/jobs/${job.id}`}
                          className="cd-btn-details"
                        >
                          View Details
                        </Link>
                      )}
                      <JobStatusBadge status={job.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Recommended Workers ── */}
        <section className="cd-section">
          <div className="cd-section-header">
            <h2 className="cd-section-title">Recommended workers near you</h2>
          </div>

          {loading ? (
            <div className="cd-loading">Loading workers…</div>
          ) : recommended.length === 0 ? (
            <div className="cd-empty"><p>No workers found.</p></div>
          ) : (
            <div className="cd-workers-grid">
              {recommended.map((w, i) => {
                const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const name = `${w.user?.first_name ?? ""} ${w.user?.last_name ?? ""}`.trim();
                const rating = w.average_rating ?? 0;
                const reviewCount = w.reviews_count ?? 0;
                return (
                  <div key={w.id} className="cd-worker-card">
                    <div
                      className="cd-worker-avatar"
                      style={{ background: ac.bg, color: ac.color }}
                    >
                      {initials(name)}
                    </div>
                    <div className="cd-worker-info">
                      <div className="cd-worker-name">{name || "Worker"}</div>
                      <div className="cd-worker-trade">{w.trade ?? w.skill ?? "—"}</div>
                      <div className="cd-worker-stars">
                        <span className="cd-stars">{renderStars(rating)}</span>
                        <span className="cd-review-count">{reviewCount}</span>
                      </div>
                      <div className="cd-worker-location">
                        <span className="cd-meta-dot" />{w.location ?? "—"}
                      </div>
                    </div>
                    <Link to={`/workers/${w.id}`} className="cd-btn-secondary">
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* wrapper — no top padding; search hero sits flush under navbar */
        .cd-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* search hero */
        .cd-search-hero {
          background: #dde8f4;
          padding: 1rem 2rem;
          display: flex;
          gap: 0;
        }
        .cd-search-input {
          flex: 1;
          padding: 0.6rem 0.9rem;
          border: 1.5px solid #d1dce8;
          border-right: none;
          border-radius: 8px 0 0 8px;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          color: #1a2333;
          height: 44px;
        }
        .cd-search-input:focus { border-color: #2e6da4; }
        .cd-search-btn {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 0 8px 8px 0;
          padding: 0 1.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          height: 44px;
          white-space: nowrap;
          font-family: inherit;
        }
        .cd-search-btn:hover { background: #223060; }

        /* content wrapper */
        .cd-content {
          padding: 1.75rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* stats */
        .cd-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 860px) {
          .cd-stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .cd-stats-row { grid-template-columns: 1fr; }
        }
        .cd-stat {
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border: 1px solid transparent;
        }
        .cd-stat-blue   { background: #e8f0fb; border-color: #c5d8f0; }
        .cd-stat-green  { background: #e8f5ee; border-color: #b8deca; }
        .cd-stat-amber  { background: #fef9ec; border-color: #f0d28a; }
        .cd-stat-label  { font-size: 0.78rem; font-weight: 600; color: #6b7a90; }
        .cd-stat-value  { font-size: 2rem; font-weight: 700; color: #1a2744; line-height: 1; }
        .cd-star        { color: #f0a500; font-size: 1.4rem; vertical-align: middle; }

        /* section */
        .cd-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .cd-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .cd-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a2744;
        }

        /* buttons */
        .cd-btn-primary {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          font-family: inherit;
          text-decoration: none;
        }
        .cd-btn-primary:hover { background: #223060; }

        .cd-btn-secondary {
          background: #fff;
          color: #1a2333;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          font-family: inherit;
          text-decoration: none;
          flex-shrink: 0;
        }
        .cd-btn-secondary:hover { background: #e8eef6; }

        .cd-btn-details {
          background: #fff;
          color: #1a2333;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-family: inherit;
        }
        .cd-btn-details:hover { background: #e8eef6; }

        .cd-btn-review {
          background: #2e7d52;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-family: inherit;
        }
        .cd-btn-review:hover { opacity: 0.88; }

        /* job list */
        .cd-job-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .cd-job-card {
          background: #fff;
          border: 1px solid #d1dce8;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(15,27,45,.07);
        }
        .cd-job-info  { flex: 1; min-width: 0; }
        .cd-job-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.2rem; color: #1a2333; }
        .cd-job-meta  { font-size: 0.8rem; color: #6b7a90; display: flex; align-items: center; gap: 0.3rem; }
        .cd-meta-dot  {
          display: inline-block;
          width: 5px; height: 5px;
          background: #6b7a90;
          border-radius: 1px;
          flex-shrink: 0;
        }
        .cd-job-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }

        /* workers grid */
        .cd-workers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 860px) {
          .cd-workers-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .cd-workers-grid { grid-template-columns: 1fr; }
        }
        .cd-worker-card {
          background: #fff;
          border: 1px solid #d1dce8;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(15,27,45,.07);
        }
        .cd-worker-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .cd-worker-info  { flex: 1; min-width: 0; }
        .cd-worker-name  { font-weight: 700; font-size: 0.9rem; color: #1a2333; }
        .cd-worker-trade { font-size: 0.78rem; color: #6b7a90; margin-top: 0.1rem; }
        .cd-worker-stars { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.25rem; }
        .cd-stars        { color: #f0a500; font-size: 0.85rem; letter-spacing: -1px; }
        .cd-review-count { font-size: 0.78rem; color: #6b7a90; }
        .cd-worker-location {
          font-size: 0.77rem;
          color: #6b7a90;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.15rem;
        }

        /* empty / loading */
        .cd-empty {
          background: #fff;
          border: 1.5px dashed #d1dce8;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          color: #6b7a90;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .cd-loading { color: #6b7a90; padding: 1.5rem; text-align: center; }

        @media (max-width: 600px) {
          .cd-content { padding: 1.25rem; }
          .cd-search-hero { padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
}
