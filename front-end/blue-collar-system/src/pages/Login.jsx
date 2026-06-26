import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { loginUser, getCurrentUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login request
      const response = await loginUser({
        email,
        password,
      });

      console.log("Login Response:", response);

      // Save JWT token
      localStorage.setItem("token", response.token);

      // Fetch logged in user
      const user = await getCurrentUser();

      console.log("Current User:", user);

      // Save user
      localStorage.setItem("user", JSON.stringify(user));

      // Update AuthContext
      setUser(user);

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Incorrect email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-card">

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Log In
            </button>

            <button
              type="button"
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Register
            </button>
          </div>

          <div className="auth-card-body">

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {tab === "login" ? (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="auth-form"
                >
                  <div className="field">
                    <label>Email Address</label>

                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Password</label>

                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Log In"}
                  </button>
                </form>

                <p className="auth-divider-text">
                  Don't have an account?
                </p>

                <div className="auth-register-btns">
                  <button
                    type="button"
                    className="auth-reg-btn auth-reg-btn-customer"
                    onClick={() => setTab("register")}
                  >
                    Register as Customer
                  </button>

                  <button
                    type="button"
                    className="auth-reg-btn auth-reg-btn-worker"
                    onClick={() => setTab("register")}
                  >
                    Register as Worker
                  </button>
                </div>

                <div className="auth-worker-info">
                  <strong>Worker registration requires:</strong>

                  <ul>
                    <li>Select your skill</li>
                    <li>Upload certificates</li>
                    <li>Admin verification</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p>Create a new account.</p>

                <Link
                  to="/register"
                  className="auth-submit-btn"
                  style={{
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Go to Registration →
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}