import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

const EMPTY = {
  first_name: "", last_name: "", email: "",
  phone: "", password: "", password_confirmation: "", role: "customer",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.errors?.join(", ") || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-inner">
          <div className="auth-logo">⚒</div>
          <h1 className="auth-headline">WorkMatch</h1>
          <p className="auth-tagline">Join thousands of skilled workers and customers already on the platform.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">It only takes a minute</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-row">
              <div className="field">
                <label className="field-label">First name</label>
                <input className="field-input" placeholder="Jane" value={form.first_name} onChange={set("first_name")} required />
              </div>
              <div className="field">
                <label className="field-label">Last name</label>
                <input className="field-input" placeholder="Doe" value={form.last_name} onChange={set("last_name")} required />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Email address</label>
              <input type="email" className="field-input" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>

            <div className="field">
              <label className="field-label">Phone number</label>
              <input type="tel" className="field-input" placeholder="+254 700 000000" value={form.phone} onChange={set("phone")} />
            </div>

            <div className="field">
              <label className="field-label">I am a</label>
              <div className="role-picker">
                {["customer", "worker"].map((r) => (
                  <label key={r} className={`role-option ${form.role === r ? "selected" : ""}`}>
                    <input type="radio" name="role" value={r} checked={form.role === r} onChange={set("role")} />
                    <span className="role-icon">{r === "customer" ? "🏗️" : "🔧"}</span>
                    <span className="role-label">{r === "customer" ? "Customer" : "Worker"}</span>
                    <span className="role-desc">{r === "customer" ? "Post jobs & hire" : "Find work & earn"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label">Password</label>
                <input type="password" className="field-input" placeholder="Min 8 characters" value={form.password} onChange={set("password")} required />
              </div>
              <div className="field">
                <label className="field-label">Confirm password</label>
                <input type="password" className="field-input" placeholder="••••••••" value={form.password_confirmation} onChange={set("password_confirmation")} required />
              </div>
            </div>

            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
