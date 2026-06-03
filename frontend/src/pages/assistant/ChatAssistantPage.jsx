import { useState } from "react";
import { FiMail, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import ChatMessageBubble from "../../components/chat/ChatMessageBubble";
import ChatComposer from "../../components/chat/ChatComposer";
import { chatApi } from "../../services/api";

const emptySnapshot = {
  intent: "business_question",
  intentLabel: "Business guidance",
  confidence: 0,
  followUpQuestion: "",
  suggestedReplies: [],
  emailAction: {
    available: true,
    label: "Email a summary",
    recipient: null,
    status: "Ready to send",
  },
};

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [assistantSnapshot, setAssistantSnapshot] = useState(emptySnapshot);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    const draft = message;
    setLoading(true);

    try {
      const response = await chatApi.sendMessage({
        threadId: 1,
        message: draft,
      });

      setMessages(response.messages || []);
      setAssistantSnapshot({
        intent: response.intent || emptySnapshot.intent,
        intentLabel: response.intentLabel || emptySnapshot.intentLabel,
        confidence: typeof response.confidence === "number" ? response.confidence : 0,
        followUpQuestion: response.followUpQuestion || "",
        suggestedReplies: response.suggestedReplies || [],
        emailAction: response.emailAction || emptySnapshot.emailAction,
      });
      setMessage("");
      toast.success("Advisor response generated.");
    } catch {
      toast.error("The advisor could not respond right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSummary = async () => {
    setSummaryLoading(true);

    try {
      const response = await chatApi.sendSummaryEmail({ threadId: 1 });
      if (response.success) {
        toast.success(response.message || "Summary email sent.");
      } else {
        toast.info(response.message || "Email summaries are not available right now.");
      }
    } catch {
      toast.error("Unable to send the summary email.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    setMessage(prompt);
  };

  const confidenceValue = Math.max(0, Math.min(1, assistantSnapshot.confidence || 0));

  return (
    <div className="page-shell">
      <SectionHeader
        title="AI Advisor Chat"
        subtitle="Ask the advisor what to fix first, how to grow, and why your website loses or wins opportunities."
        actions={
          <div className="d-flex align-items-center gap-2">
            <StatusBadge tone="primary">{assistantSnapshot.intentLabel}</StatusBadge>
            <button
              type="button"
              className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
              onClick={handleEmailSummary}
              disabled={summaryLoading}
            >
              <FiMail />
              {summaryLoading ? "Sending..." : "Email summary"}
            </button>
          </div>
        }
      />

      <div className="surface-card p-4 mb-4">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <div className="section-kicker mb-1">Advisor mode</div>
            <h3 className="h5 fw-bold mb-2">Simple business growth conversation</h3>
            <p className="text-secondary mb-0" style={{ maxWidth: 900 }}>
              Paste a website link, ask what to improve, or request the next best move. The assistant uses the website analysis
              context and the live chat to keep the advice practical.
            </p>
          </div>
          <div className="text-start text-md-end">
            <div className="small text-uppercase text-secondary fw-bold">Confidence</div>
            <div className="fs-3 fw-bold" style={{ color: "var(--abga-primary)" }}>
              {Math.round(confidenceValue * 100)}%
            </div>
            <div className="small text-secondary">{assistantSnapshot.emailAction?.status || "Summary email ready"}</div>
          </div>
        </div>

        {assistantSnapshot.followUpQuestion ? (
          <div className="alert alert-light border mt-3 mb-0">
            <strong>Suggested follow-up:</strong> {assistantSnapshot.followUpQuestion}
          </div>
        ) : null}
      </div>

      <div className="surface-card p-0 overflow-hidden">
        <div className="chat-thread p-3 p-lg-4 d-grid gap-3" style={{ minHeight: 420 }}>
          {messages.length ? (
            messages.map((item) => <ChatMessageBubble key={item.id} message={item} />)
          ) : (
            <div className="alert alert-light border mb-0">
              Start the conversation by pasting a website link or asking what to improve first.
            </div>
          )}
        </div>

        {assistantSnapshot.suggestedReplies.length ? (
          <div className="px-3 px-lg-4 pb-3">
            <div className="d-flex flex-wrap gap-2">
              {assistantSnapshot.suggestedReplies.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="btn btn-light border"
                  onClick={() => handleSuggestionClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="border-top p-3 p-lg-4" style={{ borderColor: "var(--abga-border)" }}>
          <ChatComposer value={message} onChange={setMessage} onSend={handleSend} loading={loading} />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <StatusBadge tone="muted">
          <FiMessageSquare className="me-1" />
          Free and simple phase 1
        </StatusBadge>
      </div>
    </div>
  );
}
