import { FiBell, FiCalendar, FiDownload, FiChevronDown, FiMenu, FiBriefcase } from "react-icons/fi";

export default function AppHeader({
  onMenuClick,
  businessName,
  website,
  dateRange,
  pageTitle,
  onDownloadReport,
}) {
  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3">
        <button type="button" className="btn btn-light border-0 d-xl-none" onClick={onMenuClick} aria-label="Open menu">
          <FiMenu />
        </button>
        <div className="app-brand-mark" style={{ width: 48, height: 48 }}>
          <FiBriefcase size={20} />
        </div>
        <div>
          <div className="small text-uppercase fw-bold text-secondary">{pageTitle}</div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h5 fw-bold mb-0">{businessName}</h1>
            <FiChevronDown className="text-secondary" />
          </div>
          <div className="small text-secondary">{website}</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-md-flex align-items-center gap-2 surface-card px-3 py-2" style={{ boxShadow: "none" }}>
          <FiCalendar className="text-secondary" />
          <span className="fw-semibold">{dateRange}</span>
          <FiChevronDown className="text-secondary" />
        </div>
        <button type="button" className="btn btn-light border-0 position-relative">
          <FiBell />
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ width: 10, height: 10, padding: 0 }}
          >
            <span className="visually-hidden">Unread notifications</span>
          </span>
        </button>
        <button type="button" className="btn btn-primary d-none d-md-inline-flex align-items-center gap-2" onClick={onDownloadReport}>
          <FiDownload />
          Download Report
        </button>
      </div>
    </header>
  );
}
