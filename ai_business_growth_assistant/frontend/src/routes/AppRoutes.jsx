import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OverviewPage from "../pages/dashboard/OverviewPage";
import BusinessAnalysisPage from "../pages/analysis/BusinessAnalysisPage";
import ReviewAnalyticsPage from "../pages/analysis/ReviewAnalyticsPage";
import CompetitorIntelligencePage from "../pages/analysis/CompetitorIntelligencePage";
import SwotPage from "../pages/analysis/SwotPage";
import RecommendationsPage from "../pages/analysis/RecommendationsPage";
import ActionPlanPage from "../pages/analysis/ActionPlanPage";
import ChatAssistantPage from "../pages/assistant/ChatAssistantPage";
import SettingsPage from "../pages/settings/SettingsPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="business-analysis" element={<BusinessAnalysisPage />} />
        <Route path="review-analytics" element={<ReviewAnalyticsPage />} />
        <Route path="competitor-intelligence" element={<CompetitorIntelligencePage />} />
        <Route path="swot-analysis" element={<SwotPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="action-plan" element={<ActionPlanPage />} />
        <Route path="ai-chat" element={<ChatAssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

