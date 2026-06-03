import {
  FiGlobe,
  FiMessageCircle,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const benefits = [
  { icon: FiGlobe, title: "Website analysis", text: "Find SEO gaps, CTA issues, and service page opportunities." },
  { icon: FiUsers, title: "Competitor intelligence", text: "Benchmark features and content against nearby rivals." },
  { icon: FiTrendingUp, title: "Prioritized growth plan", text: "Rank actions by impact, effort, and likely revenue lift." },
  { icon: FiMessageCircle, title: "AI consultant chat", text: "Ask contextual questions about your business performance." },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-vh-100 d-flex" style={{ background: "linear-gradient(180deg, #f5f7fb 0%, #eef3ff 100%)" }}>
      <div
        className="d-none d-lg-flex col-lg-5 p-5 flex-column justify-content-between"
        style={{
          background:
            "linear-gradient(180deg, #151833 0%, #101327 100%)",
          color: "#fff",
        }}
      >
        <div>
          <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 18px 30px rgba(79, 70, 229, 0.24)" }}>
            <FiShield size={26} />
          </div>
          <h2 className="display-6 fw-bold mb-3 text-white">AI Business Growth Assistant</h2>
          <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: 480 }}>
            A professional SaaS dashboard that turns website, review, and competitor data into practical growth actions.
          </p>

          <div className="d-grid gap-3">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="d-flex gap-3 align-items-start p-3 rounded-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex-shrink-0 d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: 42, height: 42, background: "rgba(255,255,255,0.08)" }}>
                    <Icon />
                  </div>
                  <div>
                    <div className="fw-bold text-white">{item.title}</div>
                    <div className="small text-white-50 mt-1">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface-card p-4" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)", boxShadow: "none" }}>
          <div className="small text-uppercase text-white-50 fw-bold mb-2">Built for local businesses</div>
          <div className="d-flex flex-wrap gap-2">
            <span className="pill-badge primary">Growth dashboard</span>
            <span className="pill-badge muted">AI insights</span>
            <span className="pill-badge success">Action plans</span>
            <span className="pill-badge warning">SEO & reviews</span>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4 p-lg-5">
        <div className="surface-card p-4 p-md-5 w-100" style={{ maxWidth: 620 }}>
          <div className="mb-4">
            <div className="app-brand-mark mb-3">
              <FiShield size={22} />
            </div>
            <h1 className="display-6 fw-bold mb-2">{title}</h1>
            <p className="text-secondary mb-0">{subtitle}</p>
          </div>
          {children}
          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

