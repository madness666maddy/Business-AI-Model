import { FiCpu, FiSend } from "react-icons/fi";

export default function ChatComposer({ value, onChange, onSend, loading = false }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || loading) {
      return;
    }

    onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-3">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-control border-0 shadow-none"
        placeholder="Ask about website gaps, competitor advantages, or the next best move..."
        rows={2}
        style={{ resize: "none", background: "transparent", paddingLeft: 0, paddingRight: 0 }}
      />
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--abga-border)" }}>
        <div className="d-flex align-items-center gap-2 text-secondary small fw-semibold text-uppercase">
          <FiCpu />
          Advisor ready
        </div>
        <button type="submit" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2" disabled={loading || !value.trim()}>
          <FiSend />
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
