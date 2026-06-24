import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob, getApplicants, getJobMatches } from "../api/jobs";
import { applyToJob } from "../api/applications";
import { getMessages, sendMessage } from "../api/messages";
import { AuthContext } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [tab, setTab] = useState("details");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getJob(id).then((r) => setJob(r.data)).catch(() => {});
    if (user?.role === "customer") {
      getApplicants(id).then((r) => setApplicants(r.data || [])).catch(() => {});
      getJobMatches(id).then((r) => setMatches(r.data || [])).catch(() => {});
    }
    getMessages(id).then((r) => setMessages(r.data || [])).catch(() => {});
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob({ job_id: id });
      setApplied(true);
    } catch { /* already applied or error */ }
    setApplying(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      await sendMessage({ job_id: id, body: msgText });
      setMessages([...messages, { sender: user, body: msgText, created_at: new Date() }]);
      setMsgText("");
    } catch {}
  };

  if (!job) return <div className="loading-state">Loading job…</div>;

  return (
    <div className="dashboard">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>

      <div className="job-detail-header">
        <div>
          <h1 className="page-title">{job.title}</h1>
          <div className="job-meta-row">
            <StatusBadge status={job.status} />
            <span>📍 {job.location || "Remote"}</span>
            <span>🏷 {job.job_type}</span>
            {job.budget && <span>💰 KES {job.budget}</span>}
          </div>
        </div>
        {user?.role === "worker" && !applied && (
          <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
            {applying ? "Applying…" : "Apply Now"}
          </button>
        )}
        {applied && <span className="badge badge-green">Applied ✓</span>}
      </div>

      <div className="tab-bar">
        {["details", "messages", ...(user?.role === "customer" ? ["applicants", "matches"] : [])].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <div className="content-card">
          <h3 className="section-title">Job Description</h3>
          <p className="prose">{job.description}</p>
          {job.skills_required && (
            <>
              <h3 className="section-title mt">Skills Required</h3>
              <div className="tag-list">
                {(Array.isArray(job.skills_required) ? job.skills_required : job.skills_required.split(",")).map((s, i) => (
                  <span key={i} className="tag">{s.trim()}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "messages" && (
        <div className="content-card messages-panel">
          <div className="message-list">
            {messages.length === 0 && <p className="empty-text">No messages yet. Start the conversation.</p>}
            {messages.map((m, i) => (
              <div key={i} className={`message-bubble ${m.sender?.id === user?.id ? "mine" : "theirs"}`}>
                <span className="message-sender">{m.sender?.first_name}</span>
                <p className="message-body">{m.body}</p>
                <span className="message-time">{new Date(m.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input className="field-input" placeholder="Type a message…" value={msgText} onChange={(e) => setMsgText(e.target.value)} />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      )}

      {tab === "applicants" && (
        <div className="content-card">
          <h3 className="section-title">Applicants ({applicants.length})</h3>
          {applicants.length === 0 ? <p className="empty-text">No applicants yet.</p> : (
            <div className="card-list">
              {applicants.map((a) => (
                <Link to={`/workers/${a.worker?.id}`} key={a.id} className="list-card">
                  <div className="list-card-main">
                    <span className="list-card-title">{a.worker?.first_name} {a.worker?.last_name}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <span className="list-card-meta">Applied {new Date(a.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "matches" && (
        <div className="content-card">
          <h3 className="section-title">Suggested Matches</h3>
          {matches.length === 0 ? <p className="empty-text">No matches found.</p> : (
            <div className="card-list">
              {matches.map((w) => (
                <Link to={`/workers/${w.id}`} key={w.id} className="list-card">
                  <div className="list-card-main">
                    <span className="list-card-title">{w.first_name} {w.last_name}</span>
                    <span className="badge badge-blue">⭐ {w.rating || "N/A"}</span>
                  </div>
                  <span className="list-card-meta">{w.skills?.join(", ")}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
