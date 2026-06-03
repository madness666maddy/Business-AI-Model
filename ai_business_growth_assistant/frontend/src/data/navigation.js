import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiCheckSquare,
  FiMessageCircle,
  FiMessageSquare,
  FiPieChart,
  FiSearch,
  FiSettings,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";

export const navigationItems = [
  { label: "Overview", path: "/", icon: FiBarChart2 },
  { label: "Business Analysis", path: "/business-analysis", icon: FiGlobe },
  { label: "Review Analytics", path: "/review-analytics", icon: FiMessageCircle },
  { label: "Competitor Intelligence", path: "/competitor-intelligence", icon: FiUsers },
  { label: "SWOT Analysis", path: "/swot-analysis", icon: FiShield },
  { label: "Recommendations", path: "/recommendations", icon: FiTrendingUp },
  { label: "Action Plan", path: "/action-plan", icon: FiCheckSquare },
  { label: "AI Chat Assistant", path: "/ai-chat", icon: FiMessageSquare },
  { label: "Settings", path: "/settings", icon: FiSettings },
];

export const quickActions = [
  { label: "Upload Website URL", icon: FiUploadCloud, path: "/business-analysis" },
  { label: "Add Competitors", icon: FiSearch, path: "/competitor-intelligence" },
  { label: "Generate Report", icon: FiActivity, path: "/recommendations" },
  { label: "Review CSV", icon: FiBriefcase, path: "/review-analytics" },
  { label: "Priority Score", icon: FiTarget, path: "/action-plan" },
  { label: "Open Chat", icon: FiMessageCircle, path: "/ai-chat" },
  { label: "Analytics", icon: FiPieChart, path: "/" },
];

