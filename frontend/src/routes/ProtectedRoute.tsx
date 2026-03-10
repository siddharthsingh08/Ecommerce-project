import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.error("You are not authorised to visit this!\nDirecting to Home Page")
    return <Navigate to="/" />;
  }

  return children;
}
