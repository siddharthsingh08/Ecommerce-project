import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

export default function TenantRoute({ children }: any) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    toast.error("You are not authorised to visit this!\nDirecting to Home Page");
    return <Navigate to="/" />;
  }

  if (!roles.includes("ROLE_TENANT")) {
    toast.error("You are not authorised to visit this!\nDirecting to Home Page");
    return <Navigate to="/" />;
  }

  return children;
}