import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiGlobe,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { dashboardApi } from "../../services/api";
import { dashboardOverview as fallbackOverview } from "../../data/mockData";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import InfoCard from "../../components/common/InfoCard";
import StatusBadge from "../../components/common/StatusBadge";
import DonutChartCard from "../../components/charts/DonutChartCard";

function valueByFeature(row, key) {
  return row[key] ? "✓" : "✕";
}

export default function OverviewPage() {
  const [overview, setOverview] = useState(fallbackOverview);

  useEffect(() => {
    let active = true;

    dashboardApi.getOverview().then((data) => {
      if (active && data) {
        setOverview(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <SectionHeader
        title="Business Analysis Summary"
        subtitle="AI-powered insights to help you grow faster"
        actions={
          <>
            <Link to="/business-analysis" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
              Website Analysis
            </Link>
            <Link to="/recommendations" className="btn btn-primary d-inline-flex align-items-center gap-2">
              View Recommendations
              <FiArrowRight />
            </Link>
          </>
        }
      />

      <div className="row g-4">
        {overview.summaryCards.map((card) => {
          const iconMap = {
            insights: <FiBarChart2 size={18} />,
            bolt: <FiTrendingUp size={18} />,
            shield: <FiShield size={18} />,
            alert: <FiAlertTriangle size={18} />,
          };

          return (
            <div className="col-12 col-sm-6 col-xl-3" key={card.title}>
              <StatCard
                title={card.title}
                value={card.value}
                suffix={card.suffix}
                trend={card.trend}
                tone={card.tone}
                icon={iconMap[card.icon] || <FiBarChart2 size={18} />}
                progress={card.progress}
              />
            </div>
          );
        })}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="surface-card p-4 h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h3 className="h4 fw-bold mb-1">Review Sentiment Overview</h3>
                <p className="section-kicker mb-0">What customers are saying and where to focus next</p>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <span className="d-inline-flex align-items-center gap-2 small text-secondary">
                  <span className="rounded-circle" style={{ width: 10, height: 10, background: "#10b981" }} /> Positive
                </span>
                <span className="d-inline-flex align-items-center gap-2 small text-secondary">
                  <span className="rounded-circle" style={{ width: 10, height: 10, background: "#f59e0b" }} /> Neutral
                </span>
                <span className="d-inline-flex align-items-center gap-2 small text-secondary">
                  <span className="rounded-circle" style={{ width: 10, height: 10, background: "#ef4444" }} /> Negative
                </span>
              </div>
            </div>

            <div className="row g-4 align-items-start">
              <div className="col-12 col-md-5">
                <DonutChartCard
                  title="Total Reviews"
                  subtitle="Sentiment mix for the selected range"
                  data={overview.sentiment
                    ? [
                        { name: "Positive", value: overview.sentiment.positive, color: "#10b981" },
                        { name: "Neutral", value: overview.sentiment.neutral, color: "#f59e0b" },
                        { name: "Negative", value: overview.sentiment.negative, color: "#ef4444" },
                      ]
                    : []}
                  centerValue={overview.sentiment?.totalReviews || 0}
                  centerLabel="Total Reviews"
                  legend={false}
                />
              </div>
              <div className="col-12 col-md-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="metric-icon" style={{ width: 36, height: 36, color: "#dc2626" }}>
                    <FiAlertTriangle size={16} />
                  </div>
                  <div className="fw-bold">Top Issues from Reviews</div>
                </div>
                <div className="d-grid gap-2">
                  {overview.sentiment.issues.map((item) => (
                    <div key={item.label} className="subtle-card p-2 d-flex justify-content-between align-items-center">
                      <span className="small text-secondary">{item.label}</span>
                      <span className="fw-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="metric-icon" style={{ width: 36, height: 36, color: "#059669" }}>
                    <FiCheckCircle size={16} />
                  </div>
                  <div className="fw-bold">Top Praises</div>
                </div>
                <div className="d-grid gap-2">
                  {overview.sentiment.praises.map((item) => (
                    <div key={item.label} className="subtle-card p-2 d-flex justify-content-between align-items-center">
                      <span className="small text-secondary">{item.label}</span>
                      <span className="fw-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="surface-card p-4 h-100">
            <h3 className="h4 fw-bold mb-1">Competitor Comparison</h3>
            <p className="section-kicker">See how you compare to top competitors</p>

            <div className="table-responsive mt-4">
              <table className="table table-clean align-middle mb-0">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="text-center">You</th>
                    <th className="text-center">Comp 1</th>
                    <th className="text-center">Comp 2</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.competitorComparison.map((row) => (
                    <tr key={row.feature}>
                      <td className="text-secondary fw-medium">{row.feature}</td>
                      <td className="text-center fw-bold" style={{ color: row.you ? "#10b981" : "#ef4444" }}>
                        {valueByFeature(row, "you")}
                      </td>
                      <td className="text-center fw-bold" style={{ color: row.comp1 ? "#10b981" : "#ef4444" }}>
                        {valueByFeature(row, "comp1")}
                      </td>
                      <td className="text-center fw-bold" style={{ color: row.comp2 ? "#10b981" : "#ef4444" }}>
                        {valueByFeature(row, "comp2")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link to="/competitor-intelligence" className="btn btn-outline-primary w-100 mt-4">
              View Full Comparison
            </Link>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
        <div>
          <h3 className="h4 fw-bold mb-1">Key Insights & Opportunities</h3>
          <p className="section-kicker mb-0">Prioritized growth signals grouped by business function</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="row g-4">
            {overview.insights.map((item) => {
              const iconMap = {
                "Website Insights": <FiGlobe size={16} />,
                "SEO Opportunities": <FiBarChart2 size={16} />,
                "Content Opportunities": <FiCheckCircle size={16} />,
                "Growth Opportunities": <FiTrendingUp size={16} />,
              };

              return (
                <div className="col-12 col-md-6 col-xl-3" key={item.title}>
                  <InfoCard
                    title={item.title}
                    tone={item.tone}
                    icon={iconMap[item.title] || <FiGlobe size={16} />}
                    bullets={item.bullets}
                    to="/business-analysis"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="surface-card p-4 h-100">
            <h3 className="h4 fw-bold mb-1">Prioritized Action Plan</h3>
            <p className="section-kicker mb-4">AI prioritized actions for maximum impact</p>

            <div className="d-grid gap-3">
              {overview.actionPlan.map((item) => (
                <div key={item.rank} className="d-flex align-items-start gap-3">
                  <div className={`action-number ${item.tone === "success" ? "success" : item.tone === "primary" ? "primary" : "warning"}`}>
                    {item.rank}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="fw-bold">{item.title}</div>
                      <StatusBadge tone={item.impact === "High" ? "success" : "warning"}>
                        {item.impact} Impact
                      </StatusBadge>
                    </div>
                    <div className="small text-secondary mt-1">
                      Impact: {item.impact} | Effort: {item.effort}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="small text-secondary">{item.status}</div>
                      <div className="fw-bold">
                        {item.score} <span className="small text-secondary fw-normal">/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/action-plan" className="btn btn-outline-primary w-100 mt-4">
              View Full Action Plan
            </Link>
          </div>
        </div>
      </div>

      <div className="surface-card dashboard-banner p-4 p-lg-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <div className="metric-icon" style={{ width: 48, height: 48 }}>
              <FiCheckCircle size={20} />
            </div>
            <div>
              <h3 className="h5 fw-bold mb-2">{overview.recommendationBanner.title}</h3>
              <p className="mb-0 text-secondary" style={{ maxWidth: 820 }}>
                {overview.recommendationBanner.message}
              </p>
            </div>
          </div>
          <Link to="/recommendations" className="btn btn-primary btn-lg">
            View Detailed Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}

