import StatusBadge from "../common/StatusBadge";

export default function ChatMessageBubble({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`d-flex ${isAssistant ? "justify-content-start" : "justify-content-end"}`}>
      <div className={`chat-message ${isAssistant ? "assistant" : "user"}`}>
        <div className="small text-uppercase fw-bold mb-2" style={{ letterSpacing: "0.16em", opacity: 0.72 }}>
          {isAssistant ? "AI Assistant" : "You"} · {message.timestamp}
        </div>
        <div>{message.text}</div>
        {message.card ? (
          <div className="message-card mt-3">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
              <div className="h5 fw-bold mb-0">{message.card.title}</div>
              <StatusBadge tone="success">{message.card.status}</StatusBadge>
            </div>
            <div className="row g-3">
              {message.card.metrics.map((metric) => (
                <div className="col-md-4" key={metric.label}>
                  <div className="surface-card p-3 h-100" style={{ background: "#f8fafc", boxShadow: "none" }}>
                    <div className="small text-uppercase text-secondary fw-bold">{metric.label}</div>
                    <div className="fs-3 fw-bold mt-2" style={{ color: "var(--abga-primary)" }}>
                      {metric.value}
                    </div>
                    <div className="small mt-1" style={{ color: metric.tone === "danger" ? "#dc2626" : "#166534" }}>
                      {metric.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

