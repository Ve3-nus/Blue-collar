import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../api/notifications";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((r) => setNotifs(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAll = async () => {
    notifs.filter((n) => !n.read).forEach((n) => handleRead(n.id));
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread} unread</p>
        </div>
        {unread > 0 && <button className="btn btn-ghost" onClick={markAll}>Mark all as read</button>}
      </div>

      {loading ? <div className="loading-state">Loading…</div> :
       notifs.length === 0 ? (
        <div className="empty-state"><p>You're all caught up. No notifications.</p></div>
      ) : (
        <div className="card-list">
          {notifs.map((n) => (
            <div key={n.id} className={`list-card notification-item ${n.read ? "read" : "unread"}`} onClick={() => !n.read && handleRead(n.id)}>
              <div className="list-card-main">
                <span className="list-card-title">{n.title || n.message}</span>
                {!n.read && <span className="unread-dot" />}
              </div>
              <span className="list-card-meta">{new Date(n.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

