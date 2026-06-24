import { useEffect, useState } from "react";
import { getAdminReviews } from "../api/admin";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminReviews().then((r) => setReviews(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">All Reviews</h1>
      <p className="page-subtitle">{reviews.length} reviews submitted</p>

      {loading ? <div className="loading-state">Loading…</div> : (
        <div className="card-list">
          {reviews.map((rv) => (
            <div key={rv.id} className="list-card">
              <div className="list-card-main">
                <span className="list-card-title">{rv.reviewer?.first_name} → {rv.worker?.first_name}</span>
                <span className="badge badge-yellow">{"⭐".repeat(rv.rating)}</span>
              </div>
              <p className="list-card-meta">{rv.comment}</p>
              <span className="text-muted small">{new Date(rv.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
