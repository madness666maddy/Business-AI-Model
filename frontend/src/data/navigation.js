import { FiBarChart2, FiMessageSquare, FiSearch } from "react-icons/fi";

export const navigationItems = [
  { label: "Website Analysis", path: "/", icon: FiBarChart2 },
  { label: "AI Chat", path: "/ai-chat", icon: FiMessageSquare },
];

export const quickActions = [
  { label: "Analyze Website", icon: FiSearch, path: "/" },
  { label: "Open Chat", icon: FiMessageSquare, path: "/ai-chat" },
];
