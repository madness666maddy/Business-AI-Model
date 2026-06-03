export default function SectionHeader({ title, subtitle, actions, className = "" }) {
  return (
    <div className={`d-flex flex-wrap align-items-end justify-content-between gap-3 ${className}`.trim()}>
      <div>
        <h2 className="section-heading">{title}</h2>
        {subtitle ? <p className="section-kicker mb-0">{subtitle}</p> : null}
      </div>
      {actions ? <div className="d-flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

