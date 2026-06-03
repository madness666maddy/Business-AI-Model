import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { navigationItems } from "../../data/navigation";
import { useAuth } from "../../context/AuthContext";

function getPageMeta(pathname) {
  const matched = navigationItems.find((item) => item.path === pathname);

  if (matched?.path === "/ai-chat") {
    return {
      title: matched.label,
      subtitle: "Ask for growth guidance, summaries, and next steps.",
    };
  }

  return {
    title: matched ? matched.label : "Website Analysis",
    subtitle: "Paste a website link to review the business growth signals.",
  };
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);

  return (
    <div className="app-shell">
      <div className="app-layout">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-main">
          <AppHeader
            onMenuClick={() => setSidebarOpen((value) => !value)}
            businessName={user?.businessName || "AI Growth Assistant"}
            pageTitle={pageMeta.title}
            pageSubtitle={pageMeta.subtitle}
          />
          <main className="page-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
