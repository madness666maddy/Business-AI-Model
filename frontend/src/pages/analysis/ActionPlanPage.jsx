import { useEffect, useMemo, useState } from "react";
import { FiCheckSquare, FiClock, FiLayers, FiTarget } from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import BarChartCard from "../../components/charts/BarChartCard";
import { analysisApi } from "../../services/api";
import { actionPlanItems as fallbackPlan } from "../../data/mockData";

function priorityBucket(item) {
  if (item.score >= 90) return "success";
  if (item.score >= 75) return "warning";
  return "muted";
}

export default function ActionPlanPage() {
  const [items, setItems] = useState(fallbackPlan);

  useEffect(() => {
    let active = true;
    analysisApi.getActionPlan().then((data) => {
      if (active && data) {
        setItems(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        label: item.title.length > 18 ? `${item.title.slice(0, 18)}...` : item.title,
        score: item.score,
      })),
    [items],
  );

  const highImpactCount = items.filter((item) => item.impact === "High").length;
  const mediumImpactCount = items.filter((item) => item.impact === "Medium").length;
  const quickWinCount = items.filter((item) => item.effort === "Low").length;

  return (
    <div className="page-shell">
      <SectionHeader
        title="Action Plan"
        subtitle="A prioritized roadmap for execution over the next 90 days"
        actions={<StatusBadge tone="primary">Execution roadmap</StatusBadge>}
      />

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Priority Items" value={items.length} trend="Roadmap tasks" tone="primary" icon={<FiCheckSquare size={18} />} progress={items.length * 20} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="High Impact" value={highImpactCount} trend="Biggest growth levers" tone="emerald" icon={<FiTarget size={18} />} progress={highImpactCount * 25} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Medium Impact" value={mediumImpactCount} trend="Supporting work" tone="amber" icon={<FiLayers size={18} />} progress={mediumImpactCount * 25} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Quick Wins" value={quickWinCount} trend="Low-effort actions" tone="blue" icon={<FiClock size={18} />} progress={quickWinCount * 25} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <BarChartCard
            title="Priority Scores"
            subtitle="Execution priority based on impact and feasibility"
            data={chartData}
            bars={[{ dataKey: "score", name: "Priority Score", fill: "#4f46e5" }]}
          />
        </div>
        <div className="col-12 col-xl-7">
          <div className="surface-card p-4 h-100">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h3 className="h4 fw-bold mb-1">Execution sequence</h3>
                <p className="section-kicker mb-0">Arrange the work by business impact, effort, and delivery speed.</p>
              </div>
              <StatusBadge tone="primary">90-day plan</StatusBadge>
            </div>

            <div className="table-responsive">
              <table className="table table-clean align-middle mb-0">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Task</th>
                    <th>Impact</th>
                    <th>Effort</th>
                    <th>Owner</th>
                    <th>Due</th>
                    <th className="text-end">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...items].sort((a, b) => b.score - a.score).map((item, index) => (
                    <tr key={item.title}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{item.title}</div>
                        <div className="small text-secondary">{item.status}</div>
                      </td>
                      <td>
                        <StatusBadge tone={item.impact === "High" ? "success" : "warning"}>{item.impact}</StatusBadge>
                      </td>
                      <td>
                        <StatusBadge tone={item.effort === "Low" ? "primary" : "muted"}>{item.effort}</StatusBadge>
                      </td>
                      <td className="text-secondary">{item.owner}</td>
                      <td className="text-secondary">{item.due}</td>
                      <td className="text-end fw-bold">{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card p-4">
        <h3 className="h5 fw-bold mb-2">How to use the action plan</h3>
        <p className="mb-0 text-secondary">
          Start with the top one or two high-impact, low-effort changes. Then expand the plan into SEO content, customer retention, and automation work once the first wins are live.
        </p>
      </div>
    </div>
  );
}

