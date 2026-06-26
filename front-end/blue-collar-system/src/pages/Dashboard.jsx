import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import CustomerDashboard from "./CustomerDashboard";
import WorkerDashboard from "./WorkerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log("Current User:", user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "customer":
      return <CustomerDashboard />;

    case "worker":
      return <WorkerDashboard />;

    case "admin":
      return <AdminDashboard />;

    default:
      return (
        <div style={{ padding: "40px" }}>
          <h2>Unknown user role</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      );
  }
}