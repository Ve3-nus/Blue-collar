import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CustomerDashboard from "./Dashboard";
import WorkerDashboard from "./WorkerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  if (user?.role === "customer") return <CustomerDashboard />;
  if (user?.role === "worker")   return <WorkerDashboard />;
  if (user?.role === "admin")    return <AdminDashboard />;
  return <div className="page-empty">Unknown role.</div>;
}


