import "../styles/CustomerDashboard.css";

export default function CustomerDashboard() {
  const recentJobs = [
    {
      id: 1,
      title: "Kitchen Electrical Repair",
      worker: "James Mutua",
      status: "In Progress",
      location: "Westlands",
      date: "Today",
    },
    {
      id: 2,
      title: "Bathroom Plumbing",
      worker: "Aisha Kamau",
      status: "Completed",
      location: "Karen",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "House Painting",
      worker: "Peter Otieno",
      status: "Pending",
      location: "Kilimani",
      date: "2 Days Ago",
    },
  ];

  const workers = [
    {
      id: 1,
      name: "James Mutua",
      skill: "Electrician",
      rating: "4.9",
    },
    {
      id: 2,
      name: "Aisha Kamau",
      skill: "Plumber",
      rating: "4.8",
    },
    {
      id: 3,
      name: "Peter Otieno",
      skill: "Painter",
      rating: "4.7",
    },
    {
      id: 4,
      name: "Mary Wanjiku",
      skill: "Carpenter",
      rating: "4.9",
    },
  ];

  return (
    <div className="customer-dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Customer Dashboard</h1>
          <p>Welcome back. Manage your jobs and hire trusted workers.</p>
        </div>

        <button className="post-job-btn">
          + Post New Job
        </button>
      </div>

      <div className="stats">

        <div className="stat-card">
          <h3>Jobs Posted</h3>
          <h2>12</h2>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <h2>3</h2>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <h2>9</h2>
        </div>

        <div className="stat-card">
          <h3>Favourite Workers</h3>
          <h2>6</h2>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="jobs-section">

          <h2>Recent Jobs</h2>

          {recentJobs.map((job) => (

            <div className="job-card" key={job.id}>

              <div>
                <h3>{job.title}</h3>

                <p>
                  {job.worker}
                </p>

                <small>
                  {job.location} • {job.date}
                </small>
              </div>

              <span
                className={`status ${job.status
                  .replace(" ", "")
                  .toLowerCase()}`}
              >
                {job.status}
              </span>

            </div>

          ))}

        </div>

        <div className="workers-section">

          <h2>Recommended Workers</h2>

          {workers.map((worker) => (

            <div className="worker-card" key={worker.id}>

              <div className="avatar">
                {worker.name.charAt(0)}
              </div>

              <div>

                <h4>{worker.name}</h4>

                <p>{worker.skill}</p>

                <small>⭐ {worker.rating}</small>

              </div>

              <button>View</button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}