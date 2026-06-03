import { useMemo, useState } from "react";
import { FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import ChatThreadList from "../../components/chat/ChatThreadList";
import ChatMessageBubble from "../../components/chat/ChatMessageBubble";
import ChatComposer from "../../components/chat/ChatComposer";
import { chatApi } from "../../services/api";
import { chatMessages as defaultMessages, chatThreads } from "../../data/mockData";

const seededConversations = {
  1: defaultMessages,
  2: [
    {
      id: 21,
      role: "assistant",
      timestamp: "Tue",
      text: "I reviewed the proposed backlink strategy. We should prioritize local citations before pursuing broad guest posts.",
    },
  ],
  3: [
    {
      id: 31,
      role: "assistant",
      timestamp: "Mon",
      text: "The content audit shows a few service pages need FAQ sections and more trust-building testimonials.",
    },
  ],
  4: [
    {
      id: 41,
      role: "assistant",
      timestamp: "Oct 12",
      text: "Your competitor benchmark suggests online booking is the strongest immediate parity gap to close.",
    },
  ],
};

export default function ChatAssistantPage() {
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [threads] = useState(chatThreads);
  const [conversationMap, setConversationMap] = useState(seededConversations);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) || threads[0],
    [activeThreadId, threads],
  );

  const visibleThreads = useMemo(
    () =>
      threads.filter(
        (thread) =>
          thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.preview.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, threads],
  );

  const messages = conversationMap[activeThreadId] || defaultMessages;

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      timestamp: "Now",
      text: message,
    };

    setLoading(true);

    try {
      const response = await chatApi.sendMessage({
        threadId: activeThreadId,
        message,
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        timestamp: "Now",
        text: response.reply || "I can help with that.",
      };

      setConversationMap((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), userMessage, assistantMessage],
      }));
      setMessage("");
      toast.success("Assistant response generated.");
    } catch {
      toast.error("The assistant could not respond right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <SectionHeader
        title="AI Chat Assistant"
        subtitle="Ask contextual business questions and explore the analysis in conversation"
        actions={<StatusBadge tone="primary">Gemini enabled</StatusBadge>}
      />

      <div className="chat-shell surface-card">
        <aside className="chat-sidebar">
          <div className="p-3 border-bottom" style={{ borderColor: "var(--abga-border)" }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
          <ChatThreadList threads={visibleThreads} activeThreadId={activeThreadId} onSelectThread={setActiveThreadId} />
          <div className="p-3 border-top" style={{ borderColor: "var(--abga-border)" }}>
            <button type="button" className="btn btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center gap-2" onClick={() => toast.info("Starting a new analysis is a backend action." )}>
              <FiPlus />
              New Analysis
            </button>
          </div>
        </aside>

        <section className="d-flex flex-column min-w-0">
          <div className="p-3 p-lg-4 border-bottom" style={{ borderColor: "var(--abga-border)" }}>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div>
                <h3 className="h5 fw-bold mb-1">{activeThread.title}</h3>
                <p className="section-kicker mb-0">{activeThread.preview}</p>
              </div>
              <StatusBadge tone="success">Live context</StatusBadge>
            </div>
          </div>

          <div className="chat-thread p-3 p-lg-4 d-grid gap-3">
            {messages.map((item) => (
              <ChatMessageBubble key={item.id} message={item} />
            ))}
          </div>

          <div className="p-3 p-lg-4 border-top" style={{ borderColor: "var(--abga-border)" }}>
            <div className="d-grid gap-3">
              <div className="d-flex flex-wrap gap-2">
                {[
                  "Summarize the website audit",
                  "What should I fix first?",
                  "Compare my competitors",
                  "Draft a 90-day plan",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="btn btn-light border"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <ChatComposer value={message} onChange={setMessage} onSend={handleSend} loading={loading} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

