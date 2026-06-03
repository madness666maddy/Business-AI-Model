import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiMinusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const toneBackground = {
  blue: "#eff6ff",
  violet: "#f5f3ff",
  emerald: "#ecfdf5",
  orange: "#fff7ed",
  primary: "#f8faff",
  amber: "#fffbeb",
  rose: "#fff1f2",
};

const toneColor = {
  blue: "#2563eb",
  violet: "#7c3aed",
  emerald: "#059669",
  orange: "#ea580c",
  primary: "var(--abga-primary)",
  amber: "#d97706",
  rose: "#e11d48",
};

function getStatusIcon(status) {
  if (status === "success") return FiCheckCircle;
  if (status === "warning") return FiAlertTriangle;
  if (status === "danger") return FiMinusCircle;
  return FiMinusCircle;
}

export default function InfoCard({
  title,
  tone = "primary",
  icon,
  bullets = [],
  linkText = "View Full Analysis",
  to,
}) {
  const accent = toneColor[tone] || "var(--abga-primary)";

  return (
    <div
      className="surface-card p-4 h-100 d-flex flex-column justify-content-between"
      style={{ background: toneBackground[tone] || "#fff" }}
    >
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="metric-icon"
            style={{ width: 36, height: 36, background: "#fff", color: accent }}
          >
            {icon}
          </div>
          <h3 className="h6 fw-bold mb-0" style={{ color: accent }}>
            {title}
          </h3>
        </div>
        <ul className="soft-list">
          {bullets.map((item) => {
            const BulletIcon = getStatusIcon(item.status);
            const bulletColor =
              item.status === "success"
                ? "#10b981"
                : item.status === "warning"
                  ? "#f59e0b"
                  : "#ef4444";

            return (
              <li key={item.label}>
                <BulletIcon size={14} style={{ color: bulletColor, marginTop: 3, flexShrink: 0 }} />
                <span className="small">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {to ? (
        <Link to={to} className="d-inline-flex align-items-center gap-1 fw-bold mt-3" style={{ color: accent }}>
          {linkText}
          <FiArrowRight />
        </Link>
      ) : null}
    </div>
  );
}

