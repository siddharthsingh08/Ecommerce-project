import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function AdminRoute({ children }: any) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }

  return children;
}
