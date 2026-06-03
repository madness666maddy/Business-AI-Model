export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface-card p-5 text-center">
      <div className="fw-bold fs-5">{title}</div>
      <p className="text-secondary mb-4 mt-2">{description}</p>
      {action ? action : null}
    </div>
  );
}

