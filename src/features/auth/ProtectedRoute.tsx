import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { th } from "zod/locales";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function ProtectedRoute() {
  const { data: profile, isLoading } = useGetProfileQuery({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.message("Signed out", {
      description: "You've been logged out of Hubology admin.",
    });
    navigate("/login", { replace: true });
  };
  const location = useLocation();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!profile || isLoading) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (profile.data.role !== "SUPER_ADMIN") {
    toast.error("You are not authorized to access this page");
    handleLogout();
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
