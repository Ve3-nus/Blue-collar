const COLOR_MAP = {
  pending: "badge-yellow",
  accepted: "badge-green",
  rejected: "badge-red",
  open: "badge-blue",
  closed: "badge-gray",
  active: "badge-green",
  suspended: "badge-red",
  completed: "badge-green",
};

export default function StatusBadge({ status }) {
  const cls = COLOR_MAP[status?.toLowerCase()] || "badge-gray";
  return <span className={`badge ${cls}`}>{status}</span>;
}

