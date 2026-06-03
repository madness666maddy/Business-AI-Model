import { FiCpu, FiImage, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";

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
        placeholder="Ask anything about your business metrics..."
        rows={2}
        style={{ resize: "none", background: "transparent", paddingLeft: 0, paddingRight: 0 }}
      />
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--abga-border)" }}>
        <div className="d-flex align-items-center gap-3 text-secondary">
          <button type="button" className="btn btn-light border-0 p-2" aria-label="Attach file">
            <FiPaperclip />
          </button>
          <button type="button" className="btn btn-light border-0 p-2" aria-label="Emoji">
            <FiSmile />
          </button>
          <button type="button" className="btn btn-light border-0 p-2" aria-label="Image">
            <FiImage />
          </button>
          <div className="vr" />
          <div className="small text-uppercase fw-bold text-secondary d-flex align-items-center gap-2">
            <FiCpu />
            Gemini enabled
          </div>
        </div>
        <button type="submit" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2" disabled={loading || !value.trim()}>
          <FiSend />
          Send
        </button>
      </div>
    </form>
  );
}

