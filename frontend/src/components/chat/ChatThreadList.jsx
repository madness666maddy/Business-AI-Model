import { FiHash } from "react-icons/fi";

export default function ChatThreadList({ threads, activeThreadId, onSelectThread }) {
  return (
    <div className="p-3 flex-grow-1 overflow-auto">
      <div className="d-grid gap-2">
        {threads.map((thread) => {
          const active = thread.id === activeThreadId;

          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelectThread(thread.id)}
              className={`text-start surface-card border-0 p-3 w-100 ${active ? "shadow-sm" : ""}`}
              style={{
                background: active ? "#fff" : "rgba(255, 255, 255, 0.7)",
                border: active ? "1px solid rgba(79, 70, 229, 0.2)" : "1px solid rgba(219, 227, 239, 0.9)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="fw-bold text-truncate" style={{ color: active ? "var(--abga-primary)" : "var(--abga-text)" }}>
                  {thread.title}
                </div>
                <span className="small text-secondary flex-shrink-0">{thread.time}</span>
              </div>
              <p className="small text-secondary mb-2 mt-2">{thread.preview}</p>
              <span className="pill-badge muted">
                <FiHash size={12} />
                {thread.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

