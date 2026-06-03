const badgeToneClass = {
  success: "success",
  warning: "warning",
  primary: "primary",
  rose: "rose",
  muted: "muted",
};

export default function StatusBadge({ tone = "muted", children, className = "" }) {
  return (
    <span className={`pill-badge ${badgeToneClass[tone] || "muted"} ${className}`.trim()}>
      {children}
    </span>
  );
}

