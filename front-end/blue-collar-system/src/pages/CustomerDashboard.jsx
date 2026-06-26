import { useEffect, useMemo, useState } from "react";
import "../styles/CustomerDashboard.css";

import {
  getMyJobs,
  createJob,
  getJobMatches,
} from "../api/jobs";

import {
  getWorkers,
} from "../api/workers";
export default function CustomerDashboard() {

  const [jobs, setJobs] = useState([]);

  const [workers, setWorkers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    skill_required: "",
    budget: "",
  });

  const [matchedWorkers, setMatchedWorkers] = useState([]);
    useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const jobData = await getMyJobs();

      const workerData = await getWorkers();

      setJobs(jobData);

      setWorkers(workerData);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };
    const stats = useMemo(() => {

    return {

      total: jobs.length,

      open: jobs.filter(j => j.status === "open").length,

      completed: jobs.filter(j => j.status === "completed").length,

      pending: jobs.filter(j => j.status === "pending").length,

    };

  }, [jobs]);  const filteredWorkers = workers.filter(worker => {

    const name = `${worker.first_name || ""} ${worker.last_name || ""}`;

    return (

      name.toLowerCase().includes(search.toLowerCase()) ||

      (worker.skill || "")
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  });  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createJob(form);

      alert("Job posted successfully.");

      setForm({

        title: "",

        description: "",

        location: "",

        skill_required: "",

        budget: "",

      });

      setShowForm(false);

      loadDashboard();

    } catch (err) {

      console.log(err);

      alert("Failed to create job.");

    }

  };   if (loading) {
    return (
      <div className="customer-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">

      {/* Header */}

      <div className="dashboard-header">
        <div>
          <h1>Customer Dashboard</h1>
          <p>Manage your jobs and hire skilled workers.</p>
        </div>

        <button
          className="post-job-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Post New Job"}
        </button>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.total}</h2>
          <span>Total Jobs</span>
        </div>

        <div className="stat-card">
          <h2>{stats.open}</h2>
          <span>Open Jobs</span>
        </div>

        <div className="stat-card">
          <h2>{stats.pending}</h2>
          <span>Pending</span>
        </div>

        <div className="stat-card">
          <h2>{stats.completed}</h2>
          <span>Completed</span>
        </div>

      </div>

      {/* Post Job Form */}

      {showForm && (

        <div className="job-form-card">

          <h2>Create New Job</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="skill_required"
              placeholder="Required Skill"
              value={form.skill_required}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={form.budget}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Post Job
            </button>

          </form>

        </div>

      )}

      {/* My Jobs */}

      <div className="section">

        <h2>My Jobs</h2>

        {jobs.length === 0 ? (

          <div className="empty-card">
            You haven't posted any jobs yet.
          </div>

        ) : (

          jobs.map(job => (

            <div
              key={job.id}
              className="job-card"
            >

              <div className="job-info">

                <h3>{job.title}</h3>

                <p>{job.description}</p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Skill:</strong> {job.skill_required}
                </p>

                <p>
                  <strong>Budget:</strong> KES {job.budget}
                </p>

                <span className={`status ${job.status}`}>
                  {job.status}
                </span>

              </div>

              <div className="job-actions">

                <button>
                  View Details
                </button>

                <button
                  onClick={async () => {

                    const workers =
                      await getJobMatches(job.id);

                    setMatchedWorkers(workers);

                  }}
                >
                  Find Workers
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* Search */}

      <div className="section">

        <div className="search-box">

          <input
            type="text"
            placeholder="Search workers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* Recommended Workers */}

      <div className="section">

        <h2>Recommended Workers</h2>

        <div className="workers-grid">

          {filteredWorkers.map(worker => (

            <div
              key={worker.id}
              className="worker-card"
            >

              <div className="avatar">

                {worker.first_name?.charAt(0)}
                {worker.last_name?.charAt(0)}

              </div>

              <h3>

                {worker.first_name} {worker.last_name}

              </h3>

              <p>

                {worker.skill}

              </p>

              <button>

                View Profile

              </button>

            </div>

          ))}

        </div>

      </div>

      {/* Matching Workers */}

      {matchedWorkers.length > 0 && (

        <div className="section">

          <h2>Matching Workers</h2>

          <div className="workers-grid">

            {matchedWorkers.map(worker => (

              <div
                key={worker.id}
                className="worker-card"
              >

                <div className="avatar">

                  {worker.first_name?.charAt(0)}
                  {worker.last_name?.charAt(0)}

                </div>

                <h3>

                  {worker.first_name} {worker.last_name}

                </h3>

                <p>

                  {worker.skill}

                </p>

                <button>

                  Hire Worker

                </button>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );

}