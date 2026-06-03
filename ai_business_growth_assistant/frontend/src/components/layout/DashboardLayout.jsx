import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { dashboardOverview } from "../../data/mockData";
import { navigationItems } from "../../data/navigation";
import { reportApi } from "../../services/api";

function getPageTitle(pathname) {
  const matched = navigationItems.find((item) => item.path === pathname);
  return matched ? matched.label : "Overview";
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const currentPageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  const handleDownloadReport = async () => {
    try {
      await reportApi.downloadPdf();
      toast.success("PDF report downloaded.");
    } catch {
      toast.error("The PDF report endpoint is not available yet.");
    }
  };

  return (
    <div className="app-shell">
      <div className="app-layout">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-main">
          <AppHeader
            onMenuClick={() => setSidebarOpen((value) => !value)}
            businessName={dashboardOverview.businessName}
            website={dashboardOverview.website}
            dateRange={dashboardOverview.dateRange}
            pageTitle={currentPageTitle}
            onDownloadReport={handleDownloadReport}
          />
          <main className="page-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

