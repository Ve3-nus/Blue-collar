import { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../api/jobs";
import { applyToJob, getMyApplications } from "../api/applications";
import { AuthContext } from "../context/AuthContext";


const SKILLS = [
  "All Skills",
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
  "Mason",
  "Mechanic",
  "Welder",
  "Roofer",
  "Tiler",
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const STATUS_STYLE = {
  pending:   { bg: "#fff3cd", color: "#856404" },
  accepted:  { bg: "#d4edda", color: "#155724" },
  rejected:  { bg: "#f8d7da", color: "#721c24" },
  completed: { bg: "#e2e8f0", color: "#475569" },
};

function AppBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "#e2e8f0", color: "#475569" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "0.2rem 0.65rem", borderRadius: 20,
      fontSize: "0.73rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

export default function WorkerDashboard() {
  const { user } = useContext(AuthContext);

  const [jobs,         setJobs]         = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs,  setLoadingJobs]  = useState(true);
  const [loadingApps,  setLoadingApps]  = useState(true);
  const [applying,     setApplying]     = useState(null);
  const [toast,        setToast]        = useState({ msg: "", type: "" });

  const [search,      setSearch]      = useState("");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [tab,         setTab]         = useState("browse");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  /* GET /api/v1/jobs — returns axios response, unwrap .data */
const loadJobs = useCallback(async () => {
  setLoadingJobs(true);
  try {
    const data = await getJobs();       // data is the array directly
    setJobs(Array.isArray(data) ? data : []);
  } catch {
    showToast("Could not load jobs.", "error");
  } finally {
    setLoadingJobs(false);
  }
}, []);

  /* GET /api/v1/my_applications — already unwrapped in applications.js */
  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const data = await getMyApplications();
      setApplications(Array.isArray(data) ? data : data?.data || []);
    } catch {
      // worker may not have any applications yet
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, [loadJobs, loadApplications]);

  /* POST /api/v1/job_applications */
  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      showToast("Application submitted!");
      loadApplications();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Unable to apply — you may have already applied.";
      showToast(msg, "error");
    } finally {
      setApplying(null);
    }
  };

  /* derived */
  const appliedJobIds = new Set(applications.map((a) => a.job?.id ?? a.job_id));

  const visibleJobs = jobs
  .filter((j) => j.status === "active")  // was "open" || "pending"
  .filter((j) =>
    skillFilter === "All Skills"
      ? true
      : (j.skill_required ?? "").toLowerCase() === skillFilter.toLowerCase()
  )
  .filter((j) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (j.title ?? "").toLowerCase().includes(q) ||
      (j.location ?? "").toLowerCase().includes(q) ||
      (j.skill_required ?? "").toLowerCase().includes(q)
    );
  });

  const totalApps    = applications.length;
  const pendingApps  = applications.filter((a) => a.status === "pending").length;
  const acceptedApps = applications.filter((a) => a.status === "accepted").length;

  return (
    <div className="wbd-wrapper">

      {toast.msg && (
        <div className={`wbd-toast wbd-toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="wbd-content">

        {/* Header */}
        <div className="wbd-header">
          <div>
            <h1 className="wbd-title">Browse Jobs</h1>
            <p className="wbd-subtitle">Find and apply to available jobs near you.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="wbd-stats">
          <div className="wbd-stat wbd-stat-blue">
            <span className="wbd-stat-val">{loadingJobs ? "…" : visibleJobs.length}</span>
            <span className="wbd-stat-lbl">Jobs Available</span>
          </div>
          <div className="wbd-stat wbd-stat-amber">
            <span className="wbd-stat-val">{loadingApps ? "…" : totalApps}</span>
            <span className="wbd-stat-lbl">Applied</span>
          </div>
          <div className="wbd-stat wbd-stat-yellow">
            <span className="wbd-stat-val">{loadingApps ? "…" : pendingApps}</span>
            <span className="wbd-stat-lbl">Pending</span>
          </div>
          <div className="wbd-stat wbd-stat-green">
            <span className="wbd-stat-val">{loadingApps ? "…" : acceptedApps}</span>
            <span className="wbd-stat-lbl">Accepted</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="wbd-tab-bar">
          <button
            className={`wbd-tab${tab === "browse" ? " wbd-tab-active" : ""}`}
            onClick={() => setTab("browse")}
          >
            Available Jobs
          </button>
          <button
            className={`wbd-tab${tab === "applied" ? " wbd-tab-active" : ""}`}
            onClick={() => setTab("applied")}
          >
            My Applications{totalApps > 0 ? ` (${totalApps})` : ""}
          </button>
        </div>

        {/* ── Browse tab ── */}
        {tab === "browse" && (
          <>
            <div className="wbd-search-row">
              <div className="wbd-search-wrap">
                <span className="wbd-search-icon">🔍</span>
                <input
                  className="wbd-search-input"
                  placeholder="Search by title, location or skill…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="wbd-search-clear" onClick={() => setSearch("")}>✕</button>
                )}
              </div>
              <select
                className="wbd-skill-select"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              >
                {SKILLS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {loadingJobs ? (
              <div className="wbd-loading">Loading jobs…</div>
            ) : visibleJobs.length === 0 ? (
              <div className="wbd-empty">
                <p>No open jobs match your filters.</p>
                <button
                  className="wbd-btn-outline"
                  onClick={() => { setSearch(""); setSkillFilter("All Skills"); }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="wbd-job-list">
                {visibleJobs.map((job) => {
                  const alreadyApplied = appliedJobIds.has(job.id);
                  return (
                    <div key={job.id} className="wbd-job-card">
                      <div className="wbd-job-top">
                        <div className="wbd-job-info">
                          <div className="wbd-job-title">{job.title}</div>
                          <div className="wbd-job-meta">
                            {job.location && (
                              <span className="wbd-chip">
                                <span className="wbd-chip-dot" />{job.location}
                              </span>
                            )}
                            {job.skill_required && (
                              <span className="wbd-chip">
                                <span className="wbd-chip-dot" />{job.skill_required}
                              </span>
                            )}
                            {job.budget && (
                              <span className="wbd-chip wbd-chip-budget">
                                KES {Number(job.budget).toLocaleString()}
                              </span>
                            )}
                            <span className="wbd-chip wbd-chip-time">
                              {timeAgo(job.created_at)}
                            </span>
                          </div>
                          {job.description && (
                            <p className="wbd-job-desc">
                              {job.description.length > 140
                                ? job.description.slice(0, 140) + "…"
                                : job.description}
                            </p>
                          )}
                        </div>

                        <div className="wbd-job-actions">
                          {alreadyApplied && (
                            <span className="wbd-applied-badge">✓ Applied</span>
                          )}
                          <Link to={`/jobs/${job.id}`} className="wbd-btn-outline">
                            View Details
                          </Link>
                          <button
                            className="wbd-btn-apply"
                            disabled={alreadyApplied || applying === job.id}
                            onClick={() => handleApply(job.id)}
                          >
                            {applying === job.id ? "Applying…" : alreadyApplied ? "Applied" : "Apply"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Applications tab ── */}
        {tab === "applied" && (
          <>
            {loadingApps ? (
              <div className="wbd-loading">Loading applications…</div>
            ) : applications.length === 0 ? (
              <div className="wbd-empty">
                <p>You haven't applied to any jobs yet.</p>
                <button className="wbd-btn-primary" onClick={() => setTab("browse")}>
                  Browse jobs
                </button>
              </div>
            ) : (
              <div className="wbd-app-list">
                {applications.map((app) => (
                  <div key={app.id} className="wbd-app-card">
                    <div className="wbd-app-info">
                      <div className="wbd-app-title">{app.job?.title ?? "Job"}</div>
                      <div className="wbd-app-meta">
                        {app.job?.location && (
                          <span className="wbd-chip">
                            <span className="wbd-chip-dot" />{app.job.location}
                          </span>
                        )}
                        {app.job?.skill_required && (
                          <span className="wbd-chip">
                            <span className="wbd-chip-dot" />{app.job.skill_required}
                          </span>
                        )}
                        {app.job?.budget && (
                          <span className="wbd-chip wbd-chip-budget">
                            KES {Number(app.job.budget).toLocaleString()}
                          </span>
                        )}
                        <span className="wbd-chip wbd-chip-time">
                          Applied {timeAgo(app.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="wbd-app-actions">
                      <AppBadge status={app.status} />
                      <Link to={`/jobs/${app.job?.id}`} className="wbd-btn-outline">
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      <style>{`
        .wbd-wrapper { display: flex; flex-direction: column; position: relative; }
        .wbd-content {
          padding: 1.75rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .wbd-toast {
          position: fixed; top: 1.25rem; right: 1.25rem; z-index: 999;
          padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.88rem;
          font-weight: 600; box-shadow: 0 4px 14px rgba(0,0,0,.15);
          animation: wbd-fade-in 0.2s ease;
        }
        .wbd-toast-success { background: #d4edda; color: #155724; border: 1px solid #b8deca; }
        .wbd-toast-error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6c4; }
        @keyframes wbd-fade-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .wbd-header   { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
        .wbd-title    { font-size:1.5rem; font-weight:700; color:#1a2744; letter-spacing:-0.3px; }
        .wbd-subtitle { font-size:0.88rem; color:#6b7a90; margin-top:0.2rem; }
        .wbd-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        @media (max-width:640px) { .wbd-stats { grid-template-columns:repeat(2,1fr); } }
        .wbd-stat { border-radius:10px; padding:1rem 1.25rem; display:flex; flex-direction:column; gap:0.2rem; border:1px solid transparent; }
        .wbd-stat-blue   { background:#e8f0fb; border-color:#c5d8f0; }
        .wbd-stat-amber  { background:#fef9ec; border-color:#f0d28a; }
        .wbd-stat-yellow { background:#fff3cd; border-color:#f0d28a; }
        .wbd-stat-green  { background:#e8f5ee; border-color:#b8deca; }
        .wbd-stat-val { font-size:1.75rem; font-weight:700; color:#1a2744; line-height:1; }
        .wbd-stat-lbl { font-size:0.73rem; font-weight:600; color:#6b7a90; }
        .wbd-tab-bar { display:flex; border-bottom:1px solid #d1dce8; }
        .wbd-tab {
          background:none; border:none; padding:0.65rem 1.25rem; font-size:0.875rem;
          font-weight:600; color:#6b7a90; cursor:pointer; border-bottom:2px solid transparent;
          margin-bottom:-1px; white-space:nowrap; font-family:inherit; transition:color 0.15s;
        }
        .wbd-tab:hover { color:#1a2333; }
        .wbd-tab-active { background:#1a2744; color:#fff; border-bottom-color:#1a2744; border-radius:8px 8px 0 0; }
        .wbd-tab-active:hover { color:#fff; }
        .wbd-search-row { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
        .wbd-search-wrap {
          flex:1; min-width:220px; display:flex; align-items:center; gap:0.5rem;
          border:1.5px solid #d1dce8; border-radius:8px; padding:0 0.85rem;
          background:#fff; height:40px; transition:border-color 0.15s;
        }
        .wbd-search-wrap:focus-within { border-color:#2e6da4; box-shadow:0 0 0 3px rgba(46,109,164,.1); }
        .wbd-search-icon  { font-size:0.85rem; flex-shrink:0; }
        .wbd-search-input { flex:1; border:none; outline:none; font-size:0.88rem; font-family:inherit; color:#1a2333; background:transparent; }
        .wbd-search-input::placeholder { color:#aab4c0; }
        .wbd-search-clear { background:none; border:none; color:#aab4c0; font-size:0.8rem; cursor:pointer; padding:0; line-height:1; }
        .wbd-search-clear:hover { color:#6b7a90; }
        .wbd-skill-select {
          border:1.5px solid #d1dce8; border-radius:8px; padding:0 0.85rem;
          height:40px; font-size:0.88rem; font-family:inherit; color:#1a2333;
          background:#fff; outline:none; cursor:pointer; flex-shrink:0;
        }
        .wbd-skill-select:focus { border-color:#2e6da4; }
        .wbd-job-list { display:flex; flex-direction:column; gap:0.65rem; }
        .wbd-job-card {
          background:#fff; border:1px solid #d1dce8; border-radius:10px;
          padding:1.1rem 1.25rem; box-shadow:0 1px 3px rgba(15,27,45,.06); transition:box-shadow 0.15s;
        }
        .wbd-job-card:hover { box-shadow:0 4px 14px rgba(15,27,45,.1); }
        .wbd-job-top  { display:flex; align-items:flex-start; gap:1.25rem; }
        .wbd-job-info { flex:1; min-width:0; }
        .wbd-job-title { font-weight:700; font-size:0.97rem; color:#1a2333; margin-bottom:0.35rem; }
        .wbd-job-desc  { font-size:0.82rem; color:#6b7a90; margin-top:0.4rem; line-height:1.55; }
        .wbd-job-meta  { display:flex; flex-wrap:wrap; gap:0.4rem; }
        .wbd-chip {
          display:inline-flex; align-items:center; gap:0.25rem;
          background:#f0f3f8; border:1px solid #e0e8f0; border-radius:20px;
          padding:0.18rem 0.6rem; font-size:0.75rem; color:#6b7a90; font-weight:500;
        }
        .wbd-chip-dot { width:4px; height:4px; background:#aab4c0; border-radius:1px; flex-shrink:0; }
        .wbd-chip-budget { color:#1a6638; background:#e8f5ee; border-color:#b8deca; }
        .wbd-chip-time   { color:#856404; background:#fff3cd; border-color:#f0d28a; }
        .wbd-job-actions { display:flex; flex-direction:column; align-items:flex-end; gap:0.4rem; flex-shrink:0; }
        .wbd-applied-badge {
          background:#e8f5ee; color:#1a6638; border:1px solid #a8d5ba;
          font-size:0.72rem; font-weight:600; padding:0.18rem 0.55rem; border-radius:20px; white-space:nowrap;
        }
        .wbd-btn-apply {
          background:#1a2744; color:#fff; border:none; border-radius:8px;
          padding:0.45rem 1rem; font-size:0.82rem; font-weight:600; cursor:pointer;
          white-space:nowrap; font-family:inherit; transition:background 0.15s, opacity 0.15s;
        }
        .wbd-btn-apply:hover:not(:disabled) { background:#223060; }
        .wbd-btn-apply:disabled { opacity:0.45; cursor:not-allowed; }
        .wbd-btn-outline {
          background:#fff; color:#1a2333; border:1.5px solid #d1dce8; border-radius:8px;
          padding:0.4rem 0.85rem; font-size:0.82rem; font-weight:500; cursor:pointer;
          white-space:nowrap; text-decoration:none; display:inline-flex; align-items:center;
          font-family:inherit; transition:background 0.15s;
        }
        .wbd-btn-outline:hover { background:#e8eef6; }
        .wbd-btn-primary {
          background:#1a2744; color:#fff; border:none; border-radius:8px;
          padding:0.5rem 1.1rem; font-size:0.875rem; font-weight:600; cursor:pointer;
          font-family:inherit; display:inline-flex; align-items:center;
        }
        .wbd-btn-primary:hover { background:#223060; }
        .wbd-app-list { display:flex; flex-direction:column; gap:0.65rem; }
        .wbd-app-card {
          background:#fff; border:1px solid #d1dce8; border-radius:10px;
          padding:1rem 1.25rem; display:flex; align-items:center; gap:1rem;
          box-shadow:0 1px 3px rgba(15,27,45,.06);
        }
        .wbd-app-info    { flex:1; min-width:0; }
        .wbd-app-title   { font-weight:600; font-size:0.95rem; color:#1a2333; margin-bottom:0.35rem; }
        .wbd-app-meta    { display:flex; flex-wrap:wrap; gap:0.4rem; }
        .wbd-app-actions { display:flex; align-items:center; gap:0.5rem; flex-shrink:0; }
        .wbd-empty {
          background:#fff; border:1.5px dashed #d1dce8; border-radius:10px;
          padding:2.5rem; text-align:center; color:#6b7a90;
          display:flex; flex-direction:column; align-items:center; gap:1rem; font-size:0.9rem;
        }
        .wbd-loading { color:#6b7a90; text-align:center; padding:2rem; font-size:0.9rem; }
        @media (max-width:600px) {
          .wbd-content { padding:1.25rem; }
          .wbd-job-top { flex-direction:column; }
          .wbd-job-actions { flex-direction:row; align-items:center; width:100%; justify-content:flex-end; }
          .wbd-app-card { flex-wrap:wrap; }
        }
      `}</style>
    </div>
  );
}
