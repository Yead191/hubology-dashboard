import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageLoader } from "@/components/ui/PageLoader";
import ServiceBookingsPage from "./features/services/ServiceBookingsPage";

// Route-level code splitting keeps the initial bundle lean — each page's
// chunk is only fetched when the admin actually navigates there.
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const DashboardOverviewPage = lazy(() => import("@/features/dashboard/DashboardOverviewPage"));
const ServicesPage = lazy(() => import("@/features/services/ServicesPage"));
const VendorApplicationsPage = lazy(() => import("@/features/vendors/VendorApplicationsPage"));
const VendorsPage = lazy(() => import("@/features/vendors/VendorsPage"));
const StorePage = lazy(() => import("@/features/store/StorePage"));
const MembershipPage = lazy(() => import("@/features/membership/MembershipPage"));
const ForumModerationPage = lazy(() => import("@/features/forum/ForumModerationPage"));
const IFundAyitiOverviewPage = lazy(() => import("@/features/ifundayiti/IFundAyitiOverviewPage"));
const IFundAyitiApplicationsPage = lazy(() => import("@/features/ifundayiti/ApplicationsPage"));
const IFundAyitiPeriodsPage = lazy(() => import("@/features/ifundayiti/ApplicationPeriodsPage"));
const IFundAyitiDonationsPage = lazy(() => import("@/features/ifundayiti/DonationsPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/bookings" element={<ServiceBookingsPage />} />
            <Route path="vendors/applications" element={<VendorApplicationsPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="store" element={<StorePage />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="forum" element={<ForumModerationPage />} />
            <Route path="ifundayiti" element={<IFundAyitiOverviewPage />} />
            <Route path="ifundayiti/applications" element={<IFundAyitiApplicationsPage />} />
            <Route path="ifundayiti/periods" element={<IFundAyitiPeriodsPage />} />
            <Route path="ifundayiti/donations" element={<IFundAyitiDonationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
