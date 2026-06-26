import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../api/jobs";
import {
  applyToJob,
  getMyApplications,
} from "../api/applications";

import "../styles/WorkerDashboard.css";

export default function WorkerDashboard() {

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {

    loadJobs();
    loadApplications();

  }, []);

  const loadJobs = async () => {

    try {

      const data = await getJobs();

      setJobs(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoadingJobs(false);

    }

  };

  const loadApplications = async () => {

    try {

      const data =
        await getMyApplications();

      setApplications(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoadingApplications(false);

    }

  };

  const apply = async (jobId) => {

    try {

      await applyToJob(jobId);

      setMessage("Application submitted successfully.");

      loadApplications();

    } catch (err) {

      setMessage(
        err.response?.data?.errors?.join(", ")
        || "Unable to apply."
      );

    }

  };

  return (

    <div className="worker-dashboard">

      <div className="dashboard-header">

        <div>

          <h1>Worker Dashboard</h1>

          <p>
            Browse available jobs and manage your applications.
          </p>

        </div>

      </div>

      {message && (

        <div className="message-box">

          {message}

        </div>

      )}

      <div className="dashboard-grid">

        <div className="jobs-section">

          <h2>Available Jobs</h2>

          {loadingJobs ? (

            <p>Loading jobs...</p>

          ) : (

            jobs
              .filter(job => job.status === "open")
              .map(job => (

                <div
                  className="job-card"
                  key={job.id}
                >

                  <h3>{job.title}</h3>

                  <p>{job.description}</p>

                  <div className="job-meta">

                    <span>📍 {job.location}</span>

                    <span>🔧 {job.skill_required}</span>

                    <span>KES {job.budget}</span>

                  </div>

                  <div className="job-actions">

                    <Link
                      to={`/jobs/${job.id}`}
                      className="details-btn"
                    >
                      Details
                    </Link>

                    <button
                      className="apply-btn"
                      onClick={() => apply(job.id)}
                    >
                      Apply
                    </button>

                  </div>

                </div>

              ))

          )}

        </div>

        <div className="applications-section">

          <h2>My Applications</h2>

          {loadingApplications ? (

            <p>Loading...</p>

          ) : (

            applications.map(application => (

              <div
                className="application-card"
                key={application.id}
              >

                <h4>

                  {application.job.title}

                </h4>

                <p>

                  {application.job.location}

                </p>

                <span
                  className={`status ${application.status}`}
                >

                  {application.status}

                </span>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}