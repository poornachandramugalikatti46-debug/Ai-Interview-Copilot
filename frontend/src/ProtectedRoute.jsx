import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");

  const googleUser =
    localStorage.getItem("googleUser");

  if (!token && !googleUser) {

    return <Navigate to="/" />;

  }

  return children;
}