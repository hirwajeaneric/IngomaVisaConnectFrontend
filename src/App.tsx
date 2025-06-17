import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RouteGuard } from "@/components/auth/RouteGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import ApplyVisa from "./pages/ApplyVisa";
import NotFound from "./pages/NotFound";
import VisaTypes from "./pages/VisaTypes";
import Requirements from "./pages/Requirements";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import ApplicationDetails from "./pages/ApplicationDetails";
import MessageDetails from "./pages/MessageDetails";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Faqs from "./pages/Faqs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPaymentDetail from "./pages/admin/AdminPaymentDetail";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdminReports from "./pages/admin/AdminReports";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceForm from "./pages/admin/AdminServiceForm";
import AdminServiceDetail from "./pages/admin/AdminServiceDetail";
import Chatbot from "./components/Chatbot";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ConfirmPasswordReset from "./components/ConfirmPasswordReset";
import AdminUpdateVisaType from "./pages/admin/AdminUpdateService";
import AdminUpdateService from "./pages/admin/AdminUpdateService";
import Payment from '@/pages/Payment';
import PaymentSuccess from '@/pages/PaymentSuccess';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner richColors />
          <BrowserRouter>
            <Chatbot />
            <Routes>
              {/* Public Visitor Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<RequestPasswordReset />} />
              <Route path="/reset-password" element={<ConfirmPasswordReset />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/visa-types" element={<VisaTypes />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Protected Visitor Routes */}
              <Route
                path="/account"
                element={
                  <RouteGuard>
                    <Dashboard />
                  </RouteGuard>
                }
              />
              <Route
                path="/apply-visa"
                element={
                  <RouteGuard>
                    <ApplyVisa />
                  </RouteGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <RouteGuard>
                    <UserProfile />
                  </RouteGuard>
                }
              />
              <Route
                path="/application/:id"
                element={
                  <RouteGuard>
                    <ApplicationDetails />
                  </RouteGuard>
                }
              />
              <Route
                path="/message/:id"
                element={
                  <RouteGuard>
                    <MessageDetails />
                  </RouteGuard>
                }
              />

              {/* Public Admin Routes */}
              <Route path="/dashboard/login" element={<AdminLogin />} />
              <Route path="/dashboard/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/dashboard/reset-password/:token" element={<AdminResetPassword />} />

              {/* Protected Admin Routes */}
              <Route
                path="/dashboard/overview"
                element={
                  <RouteGuard requireAdmin>
                    <AdminDashboard />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RouteGuard requireAdmin>
                    <Navigate to="/dashboard/overview" replace />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/applications"
                element={
                  <RouteGuard requireAdmin>
                    <AdminApplications />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/application/:id"
                element={
                  <RouteGuard requireAdmin>
                    <AdminApplicationDetail />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/messages"
                element={
                  <RouteGuard requireAdmin>
                    <AdminMessages />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/interviews"
                element={
                  <RouteGuard requireAdmin>
                    <AdminInterviews />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/payments"
                element={
                  <RouteGuard requireAdmin>
                    <AdminPayments />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/payment/:id"
                element={
                  <RouteGuard requireAdmin>
                    <AdminPaymentDetail />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <RouteGuard requireAdmin>
                    <AdminProfile />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <RouteGuard requireAdmin>
                    <AdminSettings />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <RouteGuard requireAdmin>
                    <AdminUsers />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/users/:id"
                element={
                  <RouteGuard requireAdmin>
                    <AdminUserDetail />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/reports"
                element={
                  <RouteGuard requireAdmin>
                    <AdminReports />
                  </RouteGuard>
                }
              />

              {/* Protected Admin Services Routes */}
              <Route
                path="/dashboard/services"
                element={
                  <RouteGuard requireAdmin>
                    <AdminServices />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/services/new"
                element={
                  <RouteGuard requireAdmin>
                    <AdminServiceForm />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/services/:id"
                element={
                  <RouteGuard requireAdmin>
                    <AdminServiceDetail />
                  </RouteGuard>
                }
              />
              <Route
                path="/dashboard/services/:id/edit"
                element={
                  <RouteGuard requireAdmin>
                    <AdminUpdateService />
                  </RouteGuard>
                }
              />

              {/* Payment Routes */}
              <Route
                path="/payment"
                element={
                  <RouteGuard>
                    <Payment />
                  </RouteGuard>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <RouteGuard>
                    <PaymentSuccess />
                  </RouteGuard>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
