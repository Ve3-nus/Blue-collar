import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createJob } from "../api/jobs";
import { getWorkers } from "../api/workers";

/* ── helpers ──────────────────────────────────────── */
const SKILLS = [
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
  "Mason",
  "Mechanic",
  "Welder",
  "Roofer",
  "Tiler",
  "HVAC Technician",
];

const AVATAR_COLORS = [
  { bg: "#b8c8d8", color: "#1a2744" },
  { bg: "#c8d8e8", color: "#1a2744" },
  { bg: "#d8c8d8", color: "#1a2744" },
  { bg: "#c8e8d8", color: "#1a5740" },
  { bg: "#e8d8c8", color: "#5a3010" },
];

const FILTER_TABS = ["All", "Nearest", "Top Rated", "Available Now"];

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function renderStars(n = 0) {
  const full = Math.round(n);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/* ══════════════════════════════════════════════════════
   POST JOB PAGE
   ══════════════════════════════════════════════════════ */
export default function PostJobPage() {
  const navigate = useNavigate();

  /* ── form state ── */
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    skill_required: "",
    budget: "",
    preferred_date: "",
  });

  /* ── workers panel state ── */
  const [workers,       setWorkers]       = useState([]);
  const [searched,      setSearched]      = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter,  setActiveFilter]  = useState(0);

  /* ── submit state ── */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /* ── find workers ── */
  const handleFindWorkers = async () => {
    setSearchLoading(true);
    setSearched(true);
    try {
      const res = await getWorkers();
      let data = res.data || [];
      if (form.skill_required) {
        data = data.filter((w) =>
          (w.trade ?? w.skill ?? "")
            .toLowerCase()
            .includes(form.skill_required.toLowerCase())
        );
      }
      setWorkers(data);
    } catch {
      setWorkers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /* ── submit job ── */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createJob(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") || "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── filter workers ── */
  const filteredWorkers = (() => {
    if (activeFilter === 0) return workers;
    if (activeFilter === 2)
      return [...workers].sort(
        (a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0)
      );
    return workers;
  })();

  const workerCount = filteredWorkers.length;

  return (
    <div className="pj-wrapper">

      {/* ── Page title ── */}
      <div className="pj-page-header">
        <Link to="/dashboard" className="pj-back">← Back</Link>
        <h1 className="pj-page-title">Post a Job Request</h1>
      </div>

      <div className="pj-layout">

        {/* ══ LEFT: Job details form ══ */}
        <div className="pj-form-card">
          <div className="pj-form-heading">Job details</div>

          {error && <div className="pj-error">{error}</div>}

          <form onSubmit={submit} className="pj-form">

            {/* Job title */}
            <div className="pj-field">
              <label className="pj-label">
                Job title <span className="pj-required">*</span>
              </label>
              <input
                className="pj-input"
                placeholder="e.g. Fix kitchen plumbing"
                value={form.title}
                onChange={update("title")}
                required
              />
            </div>

            {/* Skill */}
            <div className="pj-field">
              <label className="pj-label">
                Skill / trade required <span className="pj-required">*</span>
              </label>
              <div className="pj-select-wrap">
                <select
                  className="pj-select"
                  value={form.skill_required}
                  onChange={update("skill_required")}
                  required
                >
                  <option value="">Select a trade…</option>
                  {SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="pj-select-arrow">▾</span>
              </div>
            </div>

            {/* Location */}
            <div className="pj-field">
              <label className="pj-label">
                Location / area <span className="pj-required">*</span>
              </label>
              <input
                className="pj-input"
                placeholder="e.g. Westlands, Nairobi"
                value={form.location}
                onChange={update("location")}
                required
              />
            </div>

            {/* Description */}
            <div className="pj-field">
              <label className="pj-label">
                Describe the work needed <span className="pj-required">*</span>
              </label>
              <textarea
                className="pj-input pj-textarea"
                placeholder="Describe what needs to be done, tools required, preferred timing, etc."
                value={form.description}
                onChange={update("description")}
                rows={4}
                required
              />
            </div>

            {/* Date + Budget row */}
            <div className="pj-row">
              <div className="pj-field">
                <label className="pj-label">
                  Preferred date <span className="pj-required">*</span>
                </label>
                <div className="pj-date-wrap">
                  <span className="pj-dot" />
                  <input
                    className="pj-input pj-date-input"
                    type="date"
                    value={form.preferred_date}
                    onChange={update("preferred_date")}
                    required
                  />
                </div>
              </div>
              <div className="pj-field">
                <label className="pj-label">Budget (optional)</label>
                <div className="pj-budget-wrap">
                  <span className="pj-currency">KES</span>
                  <input
                    className="pj-input pj-budget-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.budget}
                    onChange={update("budget")}
                  />
                </div>
              </div>
            </div>

            {/* Find workers button */}
            <button
              type="button"
              className="pj-find-btn"
              onClick={handleFindWorkers}
              disabled={searchLoading}
            >
              <span className="pj-btn-dot" />
              {searchLoading ? "Searching…" : "Find Available Workers"}
            </button>

            <div className="pj-divider">
              <span>or browse all verified workers</span>
            </div>

            <Link to="/workers" className="pj-browse-btn">
              Browse All Workers
            </Link>

            {/* Separator */}
            <div className="pj-form-sep" />

            {/* Post job submit */}
            <button
              type="submit"
              className="pj-submit-btn"
              disabled={loading}
            >
              {loading ? "Posting…" : "Post Job"}
            </button>

          </form>
        </div>

        {/* ══ RIGHT: Workers results panel ══ */}
        <div className="pj-results-card">
          {!searched ? (
            <div className="pj-results-empty-state">
              <div className="pj-results-empty-icon">🔍</div>
              <div className="pj-results-empty-title">Find matching workers</div>
              <p className="pj-results-empty-text">
                Fill in the job details and click
                <strong> Find Available Workers</strong> to see verified
                professionals near you.
              </p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="pj-results-header">
                <div>
                  <div className="pj-results-title">
                    {searchLoading
                      ? "Searching…"
                      : `${workerCount} verified worker${workerCount !== 1 ? "s" : ""} available`}
                  </div>
                  {!searchLoading && (
                    <div className="pj-results-meta">
                      Showing results for:
                      {form.skill_required && ` ${form.skill_required}`}
                      {form.location && ` · ${form.location}`}
                      {" · Today"}
                    </div>
                  )}
                </div>
              </div>

              {/* Filter tabs */}
              {!searchLoading && (
                <div className="pj-filter-tabs">
                  {FILTER_TABS.map((label, i) => (
                    <button
                      key={i}
                      className={`pj-filter-tab${activeFilter === i ? " pj-filter-active" : ""}`}
                      onClick={() => setActiveFilter(i)}
                      type="button"
                    >
                      {i === 0 ? `All (${workerCount})` : label}
                    </button>
                  ))}
                </div>
              )}

              {/* Worker rows */}
              {searchLoading ? (
                <div className="pj-loading">Looking for workers…</div>
              ) : filteredWorkers.length === 0 ? (
                <div className="pj-no-results">
                  <p>No verified workers found for these criteria.</p>
                  <Link to="/workers" className="pj-browse-btn" style={{ display: "inline-flex", width: "auto" }}>
                    Browse all workers
                  </Link>
                </div>
              ) : (
                <div className="pj-worker-list">
                  {filteredWorkers.map((w, i) => {
                    const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const name = `${w.user?.first_name ?? ""} ${w.user?.last_name ?? ""}`.trim() || "Worker";
                    const rating = w.average_rating ?? 0;
                    const reviewCount = w.reviews_count ?? 0;
                    const isVerified = w.verified ?? false;
                    const available = w.availability_note ?? (i % 3 === 2 ? "Available tomorrow" : "Available today");

                    return (
                      <div key={w.id} className="pj-worker-row">
                        {/* Avatar */}
                        <div
                          className="pj-worker-avatar"
                          style={{ background: ac.bg, color: ac.color }}
                        >
                          {initials(name)}
                        </div>

                        {/* Info */}
                        <div className="pj-worker-info">
                          <div className="pj-worker-name">{name}</div>
                          <div className="pj-worker-trade">{w.trade ?? w.skill ?? "General Worker"}</div>
                          <div className="pj-worker-rating">
                            <span className="pj-stars">{renderStars(rating)}</span>
                            <span className="pj-rating-val">
                              {rating > 0 ? rating.toFixed(1) : "—"}
                            </span>
                            {reviewCount > 0 && (
                              <span className="pj-review-count">({reviewCount} reviews)</span>
                            )}
                          </div>
                          <div className="pj-worker-location">
                            <span className="pj-loc-dot" />
                            {w.location ?? "Nairobi"}
                          </div>
                          <div className="pj-worker-avail">
                            <span className="pj-avail-dot" />
                            {available}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pj-worker-actions">
                          {isVerified && (
                            <span className="pj-verified-badge">✓ Verified</span>
                          )}
                          <div className="pj-action-btns">
                            <Link
                              to={`/workers/${w.id}`}
                              className="pj-btn-view"
                            >
                              View Profile
                            </Link>
                            <button
                              type="button"
                              className="pj-btn-select"
                              onClick={() => navigate(`/workers/${w.id}`)}
                            >
                              Select
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
        </div>

      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* page wrapper — uses existing .page-content padding from App shell */
        .pj-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* page header */
        .pj-page-header { display: flex; flex-direction: column; gap: 0.25rem; }
        .pj-back {
          font-size: 0.82rem;
          font-weight: 500;
          color: #2e6da4;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          width: fit-content;
        }
        .pj-back:hover { color: #3d7fc1; }
        .pj-page-title { font-size: 1.5rem; font-weight: 700; color: #1a2744; letter-spacing: -0.3px; }

        /* two-column layout */
        .pj-layout {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 1.25rem;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .pj-layout { grid-template-columns: 1fr; }
        }

        /* ── FORM CARD ── */
        .pj-form-card {
          background: #fff;
          border: 1px solid #d1dce8;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(15,27,45,.07);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .pj-form-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a2744;
          margin-bottom: 1.25rem;
        }
        .pj-error {
          background: #fdecea;
          color: #b71c1c;
          border: 1px solid #f5c6c4;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .pj-form { display: flex; flex-direction: column; gap: 1rem; }

        /* fields */
        .pj-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .pj-label { font-size: 0.8rem; font-weight: 600; color: #6b7a90; }
        .pj-required { color: #c0392b; }

        .pj-input {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #1a2333;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .pj-input:focus {
          border-color: #2e6da4;
          box-shadow: 0 0 0 3px rgba(46,109,164,.1);
        }
        .pj-input::placeholder { color: #aab4c0; }
        .pj-textarea { resize: vertical; min-height: 96px; }

        /* select wrapper */
        .pj-select-wrap { position: relative; }
        .pj-select {
          width: 100%;
          padding: 0.6rem 2rem 0.6rem 0.85rem;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #1a2333;
          background: #fff;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .pj-select:focus { border-color: #2e6da4; box-shadow: 0 0 0 3px rgba(46,109,164,.1); }
        .pj-select-arrow {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6b7a90;
          font-size: 0.75rem;
        }

        /* date + budget side by side */
        .pj-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .pj-date-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          padding: 0 0.7rem;
          background: #fff;
          height: 40px;
          transition: border-color 0.15s;
        }
        .pj-date-wrap:focus-within { border-color: #2e6da4; box-shadow: 0 0 0 3px rgba(46,109,164,.1); }
        .pj-dot {
          width: 5px; height: 5px;
          background: #aab4c0;
          border-radius: 1px;
          flex-shrink: 0;
        }
        .pj-date-input {
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          height: 100%;
          flex: 1;
          font-size: 0.88rem;
        }

        .pj-budget-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          background: #fff;
          height: 40px;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .pj-budget-wrap:focus-within { border-color: #2e6da4; box-shadow: 0 0 0 3px rgba(46,109,164,.1); }
        .pj-currency {
          padding: 0 0.65rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #6b7a90;
          background: #f0f3f8;
          border-right: 1.5px solid #d1dce8;
          height: 100%;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .pj-budget-input {
          border: none !important;
          box-shadow: none !important;
          padding: 0 0.75rem !important;
          flex: 1;
          font-size: 0.9rem;
          min-width: 0;
        }

        /* Find workers primary btn */
        .pj-find-btn {
          width: 100%;
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: inherit;
          transition: background 0.15s;
          margin-top: 0.25rem;
        }
        .pj-find-btn:hover:not(:disabled) { background: #223060; }
        .pj-find-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pj-btn-dot {
          width: 5px; height: 5px;
          background: rgba(255,255,255,0.5);
          border-radius: 1px;
          flex-shrink: 0;
        }

        /* divider */
        .pj-divider {
          text-align: center;
          font-size: 0.8rem;
          color: #aab4c0;
          position: relative;
        }
        .pj-divider::before,
        .pj-divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: calc(50% - 80px);
          height: 1px;
          background: #e8eef6;
        }
        .pj-divider::before { left: 0; }
        .pj-divider::after  { right: 0; }

        /* browse all btn */
        .pj-browse-btn {
          width: 100%;
          background: #f0f3f8;
          color: #1a2333;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-family: inherit;
          transition: background 0.15s;
          box-sizing: border-box;
        }
        .pj-browse-btn:hover { background: #e2e8f0; }

        /* separator before post button */
        .pj-form-sep {
          height: 1px;
          background: #e8eef6;
          margin: 0.25rem 0;
        }

        /* submit / post job btn */
        .pj-submit-btn {
          width: 100%;
          background: #2e7d52;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .pj-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .pj-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── RESULTS CARD ── */
        .pj-results-card {
          background: #fff;
          border: 1px solid #d1dce8;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(15,27,45,.07);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 320px;
        }

        /* empty state */
        .pj-results-empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.75rem;
          padding: 2rem;
          color: #6b7a90;
        }
        .pj-results-empty-icon { font-size: 2.5rem; }
        .pj-results-empty-title { font-size: 1rem; font-weight: 700; color: #1a2744; }
        .pj-results-empty-text { font-size: 0.88rem; line-height: 1.6; max-width: 300px; }

        /* results header */
        .pj-results-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .pj-results-title  { font-weight: 700; font-size: 1rem; color: #1a2744; }
        .pj-results-meta   { font-size: 0.78rem; color: #6b7a90; margin-top: 0.2rem; }

        /* filter tabs */
        .pj-filter-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .pj-filter-tab {
          padding: 0.35rem 0.9rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          background: #e8eef6;
          color: #6b7a90;
          font-family: inherit;
          transition: background 0.15s;
        }
        .pj-filter-tab:hover { background: #d1dce8; color: #1a2333; }
        .pj-filter-active   { background: #1a2744 !important; color: #fff !important; }

        /* worker list */
        .pj-worker-list { display: flex; flex-direction: column; gap: 0.65rem; }
        .pj-worker-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.1rem;
          border: 1px solid #d1dce8;
          border-radius: 10px;
          background: #fff;
          transition: box-shadow 0.15s;
        }
        .pj-worker-row:hover { box-shadow: 0 4px 14px rgba(15,27,45,.1); }

        /* avatar */
        .pj-worker-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        /* info */
        .pj-worker-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
        .pj-worker-name  { font-weight: 700; font-size: 0.95rem; color: #1a2333; }
        .pj-worker-trade { font-size: 0.8rem; color: #6b7a90; }
        .pj-worker-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          margin-top: 0.1rem;
        }
        .pj-stars        { color: #f0a500; letter-spacing: -1px; font-size: 0.82rem; }
        .pj-rating-val   { font-weight: 600; color: #1a2333; }
        .pj-review-count { color: #6b7a90; font-size: 0.78rem; }

        .pj-worker-location {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: #6b7a90;
          margin-top: 0.1rem;
        }
        .pj-loc-dot {
          width: 5px; height: 5px;
          background: #aab4c0;
          border-radius: 1px;
          flex-shrink: 0;
        }
        .pj-worker-avail {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: #2e7d52;
          font-weight: 500;
          margin-top: 0.05rem;
        }
        .pj-avail-dot {
          width: 5px; height: 5px;
          background: #2e7d52;
          border-radius: 1px;
          flex-shrink: 0;
        }

        /* actions column */
        .pj-worker-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .pj-verified-badge {
          background: #e8f5ee;
          color: #1a6638;
          border: 1px solid #a8d5ba;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.18rem 0.55rem;
          border-radius: 20px;
          white-space: nowrap;
        }
        .pj-action-btns { display: flex; gap: 0.4rem; }
        .pj-btn-view {
          background: #fff;
          color: #1a2333;
          border: 1.5px solid #d1dce8;
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          font-family: inherit;
          transition: background 0.15s;
        }
        .pj-btn-view:hover { background: #e8eef6; }
        .pj-btn-select {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: background 0.15s;
        }
        .pj-btn-select:hover { background: #223060; }

        /* loading / no-results */
        .pj-loading    { color: #6b7a90; text-align: center; padding: 2rem; }
        .pj-no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
          color: #6b7a90;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .pj-row { grid-template-columns: 1fr; }
          .pj-worker-row { flex-wrap: wrap; }
          .pj-worker-actions { flex-direction: row; width: 100%; justify-content: space-between; align-items: center; }
        }
      `}</style>
    </div>
  );
}
