import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function TenantRoute({ children }: any) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    alert("You are not authorised to visit this!\nDirecting to Home Page");
    return <Navigate to="/" />;
  }

  if (!roles.includes("ROLE_TENANT")) {
    alert("You are not authorised to visit this!\nDirecting to Home Page");
    return <Navigate to="/" />;
  }

  return children;
}