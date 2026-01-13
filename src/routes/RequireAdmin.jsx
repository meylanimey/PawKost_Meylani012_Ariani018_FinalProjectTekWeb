import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
}