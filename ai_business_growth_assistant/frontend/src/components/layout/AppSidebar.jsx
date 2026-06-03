import { NavLink } from "react-router-dom";
import { FiChevronDown, FiLayers, FiStar, FiX } from "react-icons/fi";
import { navigationItems } from "../../data/navigation";
import { mockAuthUser } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

export default function AppSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const activeUser = user || mockAuthUser;

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="app-sidebar-brand">
          <div className="app-brand-mark">
            <FiLayers size={22} />
          </div>
          <div>
            <div className="h5 fw-bold mb-1 text-white">AI Business Growth</div>
            <div className="small text-white-50">Assistant Platform</div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-xl-none ms-auto"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="app-sidebar-nav">
          <div className="d-grid gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="app-sidebar-footer">
          <div className="app-sidebar-card">
            <div className="text-uppercase small fw-bold text-white-50 mb-2">Business Health</div>
            <div className="d-flex align-items-end gap-2">
              <div className="display-6 fw-bold lh-1 text-white">78</div>
              <div className="text-white-50 fw-semibold pb-2">/100</div>
            </div>
            <div className="progress mt-3" style={{ height: 6, background: "rgba(255,255,255,0.08)" }}>
              <div className="progress-bar" style={{ width: "78%", background: "#34d399" }} />
            </div>
            <div className="fw-bold mt-3" style={{ color: "#34d399" }}>
              Good Performance
            </div>
            <div className="small text-white-50 mt-1">Ahead of 62% of local businesses</div>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3 mt-4 pt-3" style={{ borderTop: "1px solid var(--abga-sidebar-border)" }}>
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-white text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                {activeUser.initials || "AB"}
              </div>
              <div>
                <div className="fw-bold text-white">{activeUser.fullName}</div>
                <div className="small text-white-50">{activeUser.role}</div>
              </div>
            </div>
            <FiChevronDown className="text-white-50" />
          </div>
          <button type="button" className="btn btn-primary w-100 mt-3">
            <FiStar className="me-2" />
            Upgrade to Pro
          </button>
        </div>
      </aside>
      {isOpen ? <button type="button" className="sidebar-backdrop border-0 p-0" onClick={onClose} aria-label="Close sidebar overlay" /> : null}
    </>
  );
}
