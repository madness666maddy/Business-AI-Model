import { FiBriefcase, FiMenu } from "react-icons/fi";

export default function AppHeader({ onMenuClick, businessName, pageTitle, pageSubtitle }) {
  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3 min-w-0">
        <button type="button" className="btn btn-light border-0 d-xl-none" onClick={onMenuClick} aria-label="Open menu">
          <FiMenu />
        </button>
        <div className="app-brand-mark" style={{ width: 48, height: 48 }}>
          <FiBriefcase size={20} />
        </div>
        <div className="min-w-0">
          <div className="small text-uppercase fw-bold text-secondary">{pageTitle}</div>
          <h1 className="h5 fw-bold mb-0 text-truncate">{businessName}</h1>
          <div className="small text-secondary text-truncate">{pageSubtitle}</div>
        </div>
      </div>

      <div className="d-none d-md-inline-flex align-items-center">
        <span className="pill-badge muted">Website analysis + advisor chat</span>
      </div>
    </header>
  );
}
