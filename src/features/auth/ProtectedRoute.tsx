import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";

export function ProtectedRoute() {
  const { data: profile, isLoading } = useGetProfileQuery({});

  const location = useLocation();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!profile || isLoading) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
