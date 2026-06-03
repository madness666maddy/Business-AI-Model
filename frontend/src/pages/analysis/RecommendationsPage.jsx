import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiDollarSign, FiStar, FiTarget, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import BarChartCard from "../../components/charts/BarChartCard";
import { analysisApi, reportApi } from "../../services/api";
import { recommendations as fallbackRecommendations } from "../../data/mockData";

function impactWeight(value) {
  if (value === "High") return 3;
  if (value === "Medium") return 2;
  return 1;
}

function effortWeight(value) {
  if (value === "Low") return 1;
  if (value === "Medium") return 2;
  return 3;
}

function parseRevenue(text) {
  const digits = text.replace(/[^0-9-]/g, "");
  if (!digits) {
    return 0;
  }
  const parts = digits.split("-").filter(Boolean);
  const averageThousands = parts.reduce((sum, part) => sum + Number(part), 0) / parts.length;
  return averageThousands * 1000;
}

export default function RecommendationsPage() {
  const [items, setItems] = useState(fallbackRecommendations);

  useEffect(() => {
    let active = true;

    analysisApi.getRecommendations().then((data) => {
      if (active && data) {
        setItems(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const priorityA = impactWeight(a.impact) * 10 - effortWeight(a.effort) * 2;
        const priorityB = impactWeight(b.impact) * 10 - effortWeight(b.effort) * 2;
        return priorityB - priorityA;
      }),
    [items],
  );

  const chartData = useMemo(
    () =>
      sortedItems.map((item) => ({
        label: item.title.length > 24 ? `${item.title.slice(0, 24)}...` : item.title,
        priority: impactWeight(item.impact) * 10 - effortWeight(item.effort) * 2,
      })),
    [sortedItems],
  );

  const highImpactCount = items.filter((item) => item.impact === "High").length;
  const lowEffortCount = items.filter((item) => item.effort === "Low").length;
  const revenuePotential = items.reduce((sum, item) => sum + parseRevenue(item.revenueEstimate), 0);

  const downloadReport = async () => {
    try {
      await reportApi.downloadPdf();
      toast.success("PDF report downloaded.");
    } catch {
      toast.error("The PDF report endpoint is not available yet.");
    }
  };

  return (
    <div className="page-shell">
      <SectionHeader
        title="Recommendations"
        subtitle="Evidence-backed actions with revenue impact estimates"
        actions={
          <>
            <button type="button" className="btn btn-outline-primary" onClick={() => toast.info("Open the AI chat for a deeper recommendation breakdown.")}>
              Open AI Chat
            </button>
            <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={downloadReport}>
              Download PDF
              <FiArrowRight />
            </button>
          </>
        }
      />

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Recommendations" value={items.length} trend="AI-generated actions" tone="primary" icon={<FiStar size={18} />} progress={items.length * 20} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="High Impact" value={highImpactCount} trend="Top priority ideas" tone="emerald" icon={<FiTarget size={18} />} progress={highImpactCount * 25} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Low Effort" value={lowEffortCount} trend="Quick wins" tone="amber" icon={<FiTrendingUp size={18} />} progress={lowEffortCount * 25} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Revenue Signal"
            value={`$${Math.round(revenuePotential / 1000)}k`}
            trend="Estimated monthly upside"
            tone="blue"
            icon={<FiDollarSign size={18} />}
            progress={Math.min(100, highImpactCount * 20)}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <BarChartCard
            title="Priority Ranking"
            subtitle="A simple score derived from impact and effort"
            data={chartData}
            bars={[{ dataKey: "priority", name: "Priority Score", fill: "#4f46e5" }]}
          />
        </div>
        <div className="col-12 col-xl-7">
          <div className="surface-card p-4 h-100">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h3 className="h4 fw-bold mb-1">Recommendation Engine Output</h3>
                <p className="section-kicker mb-0">Each item includes evidence and an estimated revenue range.</p>
              </div>
              <StatusBadge tone="primary">AI reasoning</StatusBadge>
            </div>

            <div className="d-grid gap-3">
              {sortedItems.map((item, index) => (
                <div key={item.title} className="subtle-card p-3">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className={`action-number ${index === 0 ? "primary" : index === 1 ? "success" : "warning"}`}>{index + 1}</div>
                      <div>
                        <div className="fw-bold fs-5">{item.title}</div>
                        <div className="small text-secondary mt-1">{item.evidence}</div>
                        <div className="small text-secondary mt-2">Estimated revenue impact: {item.revenueEstimate}</div>
                      </div>
                    </div>
                    <div className="d-grid gap-2 text-end">
                      <StatusBadge tone={item.impact === "High" ? "success" : "warning"}>{item.impact} Impact</StatusBadge>
                      <StatusBadge tone={item.effort === "Low" ? "primary" : "muted"}>{item.effort} Effort</StatusBadge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link to="/action-plan" className="btn btn-outline-primary">
                Build Action Plan
              </Link>
              <Link to="/ai-chat" className="btn btn-primary">
                Ask the AI Consultant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
