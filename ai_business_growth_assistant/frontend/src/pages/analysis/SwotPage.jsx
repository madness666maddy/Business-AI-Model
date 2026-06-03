import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { analysisApi } from "../../services/api";
import { swotMatrix as fallbackSwot } from "../../data/mockData";

function quadrantTone(title) {
  if (title === "Strengths") return "emerald";
  if (title === "Weaknesses") return "rose";
  if (title === "Opportunities") return "blue";
  return "amber";
}

function quadrantIcon(title) {
  if (title === "Strengths") return <FiCheckCircle size={16} />;
  if (title === "Weaknesses") return <FiAlertTriangle size={16} />;
  if (title === "Opportunities") return <FiTrendingUp size={16} />;
  return <FiShield size={16} />;
}

function SwotQuadrant({ title, items }) {
  const tone = quadrantTone(title);

  return (
    <div className="surface-card p-4 h-100" style={{ background: tone === "emerald" ? "#ecfdf5" : tone === "rose" ? "#fff1f2" : tone === "blue" ? "#eff6ff" : "#fffbeb" }}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="metric-icon" style={{ width: 36, height: 36 }}>
          {quadrantIcon(title)}
        </div>
        <div>
          <div className="fw-bold">{title}</div>
          <div className="small text-secondary">{items.length} items identified</div>
        </div>
      </div>
      <div className="d-grid gap-2">
        {items.map((item) => (
          <div key={item} className="subtle-card p-3">
            <div className="d-flex align-items-start gap-2">
              <span className="mt-1 rounded-circle" style={{ width: 8, height: 8, background: tone === "emerald" ? "#10b981" : tone === "rose" ? "#ef4444" : tone === "blue" ? "#4f46e5" : "#f59e0b", flexShrink: 0 }} />
              <div className="small">{item}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SwotPage() {
  const [analysis, setAnalysis] = useState(fallbackSwot);

  useEffect(() => {
    let active = true;

    analysisApi.getSwot().then((data) => {
      if (active && data) {
        setAnalysis(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <SectionHeader
        title="SWOT Analysis"
        subtitle="A clear strategic snapshot of internal and external factors"
        actions={<StatusBadge tone="primary">Strategic overview</StatusBadge>}
      />

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Strengths" value={analysis.strengths.length} trend="Internal advantages" tone="emerald" icon={<FiCheckCircle size={18} />} progress={analysis.strengths.length * 20} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Weaknesses" value={analysis.weaknesses.length} trend="Internal friction points" tone="rose" icon={<FiAlertTriangle size={18} />} progress={analysis.weaknesses.length * 20} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Opportunities" value={analysis.opportunities.length} trend="Growth levers" tone="blue" icon={<FiTrendingUp size={18} />} progress={analysis.opportunities.length * 20} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Threats" value={analysis.threats.length} trend="External risks" tone="amber" icon={<FiShield size={18} />} progress={analysis.threats.length * 20} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <SwotQuadrant title="Strengths" items={analysis.strengths} />
        </div>
        <div className="col-12 col-lg-6">
          <SwotQuadrant title="Weaknesses" items={analysis.weaknesses} />
        </div>
        <div className="col-12 col-lg-6">
          <SwotQuadrant title="Opportunities" items={analysis.opportunities} />
        </div>
        <div className="col-12 col-lg-6">
          <SwotQuadrant title="Threats" items={analysis.threats} />
        </div>
      </div>

      <div className="surface-card p-4 dashboard-banner">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h3 className="h5 fw-bold mb-2">Strategic takeaway</h3>
            <p className="mb-0 text-secondary">
              The strongest near-term wins come from reducing booking friction, adding FAQ support, and capturing local SEO opportunities.
            </p>
          </div>
          <StatusBadge tone="success">Ready for action planning</StatusBadge>
        </div>
      </div>
    </div>
  );
}

