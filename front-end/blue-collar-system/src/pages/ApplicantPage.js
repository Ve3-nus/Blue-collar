import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getApplicants,
  updateApplication,
} from "../api/applications";

import "../styles/ApplicantsPage.css";

export default function ApplicantsPage() {

  const { id } = useParams();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {

      const data =
        await getApplicants(id);

      setApplications(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const changeStatus = async (
    applicationId,
    status
  ) => {

    try {

      await updateApplication(
        applicationId,
        status
      );

      loadApplicants();

    } catch (err) {

      console.log(err);

    }
  };

  if (loading) {

    return (
      <div className="loading">
        Loading applicants...
      </div>
    );

  }

  return (

    <div className="applicants-page">

      <h1>Applicants</h1>

      {applications.length === 0 ? (

        <div className="empty">

          No workers have applied yet.

        </div>

      ) : (

        <div className="applicants-grid">

          {applications.map((application) => (

            <div
              className="applicant-card"
              key={application.id}
            >

              <div className="avatar">

                {application.worker_profile.user.first_name[0]}

              </div>

              <div className="info">

                <h2>

                  {application.worker_profile.user.first_name}{" "}
                  {application.worker_profile.user.last_name}

                </h2>

                <p>

                  {application.worker_profile.skill}

                </p>

                <p>

                  {application.worker_profile.location}

                </p>

                <p>

                  Status:
                  {" "}
                  <strong>

                    {application.status}

                  </strong>

                </p>

              </div>

              <div className="actions">

                {application.status === "pending" && (

                  <>

                    <button
                      className="accept-btn"
                      onClick={() =>
                        changeStatus(
                          application.id,
                          "accepted"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        changeStatus(
                          application.id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </>

                )}

                {application.status !==
                  "pending" && (

                  <div
                    className={
                      "status " +
                      application.status
                    }
                  >

                    {application.status}

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}