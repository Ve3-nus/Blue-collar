import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Workers from "./pages/WorkersPage";
import Jobs from "./pages/JobsPage";
import MyJobsPage from "./pages/MyJobsPage";
import PostJobPage from "./pages/PostJobPage";
import ApplicantsPage from "./pages/ApplicantPage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import Skills from "./pages/SkillsPage";
import Applications from "./pages/MyApplicationsPage";
import Notifications from "./pages/NotificationPage";
import Analytics from "./pages/AnalyticsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsersPage";
import AdminJobs from "./pages/AdminJobsPage";
import AdminReviews from "./pages/AdminReviewsPage";

import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import "./pages/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================ PROTECTED ROUTES ================ */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Workers */}

          <Route
            path="/workers"
            element={<Workers />}
          />

          <Route
            path="/worker-profile"
            element={<WorkerProfilePage />}
          />

          {/* Jobs */}

          <Route
            path="/jobs"
            element={<Jobs />}
          />

          <Route
            path="/jobs/create"
            element={<PostJobPage />}
          />

          <Route
            path="/my-jobs"
            element={<MyJobsPage />}
          />

          <Route
            path="/jobs/:id"
            element={<MyJobsPage />}
          />

          <Route
            path="/jobs/:id/applicants"
            element={<ApplicantsPage />}
          />

          {/* Skills */}

          <Route
            path="/skills"
            element={<Skills />}
          />

          {/* Applications */}

          <Route
            path="/applications"
            element={<Applications />}
          />

          {/* Notifications */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* Analytics */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Admin */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/jobs"
            element={<AdminJobs />}
          />

          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;