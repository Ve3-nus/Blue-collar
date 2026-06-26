import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobs";
import "../styles/PostJobPage.css";

export default function PostJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    skill_required: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createJob(form);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
          "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">

      <div className="post-card">

        <h1>Post New Job</h1>

        <p>
          Fill in the details below and workers
          matching the required skill will be able
          to apply.
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          <div className="field">
            <label>Job Title</label>

            <input
              value={form.title}
              onChange={update("title")}
              placeholder="Kitchen wiring repair"
              required
            />
          </div>

          <div className="field">
            <label>Description</label>

            <textarea
              rows="5"
              value={form.description}
              onChange={update("description")}
              placeholder="Describe the work..."
              required
            />
          </div>

          <div className="field">
            <label>Location</label>

            <input
              value={form.location}
              onChange={update("location")}
              placeholder="Westlands"
              required
            />
          </div>

          <div className="field">
            <label>Required Skill</label>

            <select
              value={form.skill_required}
              onChange={update("skill_required")}
            >
              <option value="">Choose Skill</option>

              <option>Electrician</option>

              <option>Plumber</option>

              <option>Painter</option>

              <option>Carpenter</option>

              <option>Mason</option>

              <option>Mechanic</option>
            </select>
          </div>

          <div className="field">
            <label>Budget (KES)</label>

            <input
              type="number"
              value={form.budget}
              onChange={update("budget")}
              required
            />
          </div>

          <button
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>

        </form>

      </div>

    </div>
  );
}