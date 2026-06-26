import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobs } from "../api/jobs";
import "../styles/MyJobsPage.css";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="jobs-loading">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="my-jobs-page">

      <div className="page-header">

        <h1>My Posted Jobs</h1>

        <Link
          to="/jobs/create"
          className="new-job-btn"
        >
          + New Job
        </Link>

      </div>

      {jobs.length === 0 ? (

        <div className="empty-box">

          <h2>No Jobs Posted</h2>

          <p>
            Start by posting your first job.
          </p>

        </div>

      ) : (

        <div className="jobs-grid">

          {jobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <h2>{job.title}</h2>

              <p>{job.description}</p>

              <div className="job-info">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  🔧 {job.skill_required}
                </span>

                <span>
                  💰 KES {job.budget}
                </span>

              </div>

              <div className="job-footer">

                <span
                  className={`status ${job.status}`}
                >
                  {job.status}
                </span>

                <div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="details-btn"
                  >
                    Details
                  </Link>

                  <Link
                    to={`/jobs/${job.id}/applicants`}
                    className="applicants-btn"
                  >
                    Applicants
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}