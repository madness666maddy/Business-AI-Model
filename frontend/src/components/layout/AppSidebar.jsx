import { NavLink } from "react-router-dom";
import { FiChevronDown, FiLayers, FiX } from "react-icons/fi";
import { navigationItems } from "../../data/navigation";
import { useAuth } from "../../context/AuthContext";

function getFallbackUser(user) {
  return (
    user || {
      initials: "AB",
      fullName: "Business Owner",
      role: "Phase 1 Access",
      businessName: "Your Business",
      email: "Connected account",
    }
  );
}

export default function AppSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const activeUser = getFallbackUser(user);

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="app-sidebar-brand">
          <div className="app-brand-mark">
            <FiLayers size={22} />
          </div>
          <div>
            <div className="h5 fw-bold mb-1 text-white">AI Growth Assistant</div>
            <div className="small text-white-50">Phase 1 - simple analytics and chat</div>
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
          <div className="d-flex align-items-center justify-content-between gap-3 pt-3" style={{ borderTop: "1px solid var(--abga-sidebar-border)" }}>
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-white text-dark fw-bold d-flex align-items-center justify-content-center"
                style={{ width: 42, height: 42 }}
              >
                {activeUser.initials || "AB"}
              </div>
              <div>
                <div className="fw-bold text-white">{activeUser.fullName}</div>
                <div className="small text-white-50">{activeUser.businessName}</div>
              </div>
            </div>
            <FiChevronDown className="text-white-50" />
          </div>
        </div>
      </aside>
      {isOpen ? <button type="button" className="sidebar-backdrop border-0 p-0" onClick={onClose} aria-label="Close sidebar overlay" /> : null}
    </>
  );
}
