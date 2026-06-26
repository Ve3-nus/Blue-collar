import {
  BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Workers from "./pages/WorkersPage";
// import WorkerProfile from "./pages/WorkerProfilePage";
import Jobs from "./pages/JobsPage";
import JobDetails from "./pages/MyJobsPage";
import CreateJob from "./pages/PostJobPage";

import Skills from "./pages/SkillsPage";

import Applications from "./pages/MyApplicationsPage";

import Notifications from "./pages/NotificationPage";
import MyJobsPage from "./pages/MyJobsPage";
import PostJobPage from "./pages/PostJobPage";
import ApplicantsPage from "./pages/ApplicantPage";

// import Reviews from "./api/reviews";

// import Messages from "./api/messages";

import Analytics from "./pages/AnalyticsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsersPage";
import AdminJobs from "./pages/AdminJobsPage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import AdminReviews from "./pages/AdminReviewsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import "./pages/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
  path="/worker-profile"
  element={
    <ProtectedRoute>
      <WorkerProfilePage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/jobs/:id/applicants"
  element={
    <ProtectedRoute>
      <ApplicantsPage />
    </ProtectedRoute>
  }
/>

        {/* WORKERS */}

        <Route
          path="/workers"
          element={
            <ProtectedRoute>
              <Workers />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/workers/:id"
          element={
            <ProtectedRoute>
              <WorkerProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* SKILLS */}

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />

        {/* JOBS */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/create"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* APPLICATIONS */}

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* REVIEWS */}

        {/* <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        /> */}

        {/* CHAT */}

        {/* <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        /> */}

        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <AdminJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
  path="/my-jobs"
  element={
    <ProtectedRoute>
      <MyJobsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/jobs/create"
  element={
    <ProtectedRoute>
      <PostJobPage />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;