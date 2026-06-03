const toneBackground = {
  primary: "#ffffff",
  blue: "#eff6ff",
  amber: "#fffbeb",
  rose: "#fef2f2",
  emerald: "#ecfdf5",
  violet: "#f5f3ff",
  orange: "#fff7ed",
};

const iconTone = {
  primary: "var(--abga-primary)",
  blue: "#2563eb",
  amber: "#d97706",
  rose: "#dc2626",
  emerald: "#059669",
  violet: "#7c3aed",
  orange: "#ea580c",
};

export default function StatCard({
  title,
  value,
  suffix = "",
  trend = "",
  icon,
  tone = "primary",
  progress,
  description = "",
}) {
  return (
    <div
      className={`surface-card metric-card tone-${tone} p-4 p-lg-4 h-100`}
      style={{ background: toneBackground[tone] || "#fff" }}
    >
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="flex-grow-1">
          <div
            className="metric-icon"
            style={{ color: iconTone[tone] || "var(--abga-primary)" }}
          >
            {icon}
          </div>
          <div className="metric-label mt-3">{title}</div>
          <div className="d-flex align-items-end gap-2 mt-2">
            <div className="metric-value">{value}</div>
            {suffix ? <div className="text-secondary fw-semibold pb-2">{suffix}</div> : null}
          </div>
          {trend ? <div className="metric-trend mt-2">{trend}</div> : null}
          {description ? <div className="text-secondary small mt-2">{description}</div> : null}
        </div>
      </div>
      {typeof progress === "number" ? (
        <div className="progress mt-4" style={{ height: 4, background: "rgba(148, 163, 184, 0.14)" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%`, background: iconTone[tone] || "var(--abga-primary)" }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      ) : null}
    </div>
  );
}

