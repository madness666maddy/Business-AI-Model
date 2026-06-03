import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiUsers, FiGlobe, FiTarget, FiBarChart2 } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import BarChartCard from "../../components/charts/BarChartCard";
import StatusBadge from "../../components/common/StatusBadge";
import { analysisApi } from "../../services/api";
import { competitorIntelligence as fallbackCompetitors } from "../../data/mockData";

export default function CompetitorIntelligencePage() {
  const [analysis, setAnalysis] = useState(fallbackCompetitors);
  const [urls, setUrls] = useState(fallbackCompetitors.competitors.map((item) => item.url));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    analysisApi.analyzeCompetitors({ urls }).then((data) => {
      if (active && data) {
        setAnalysis(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await analysisApi.analyzeCompetitors({ urls });
      setAnalysis(response || fallbackCompetitors);
      toast.success("Competitor analysis refreshed.");
    } catch {
      toast.error("Unable to analyze competitors right now.");
    } finally {
      setLoading(false);
    }
  };

  const seoAverages = Math.round(
    analysis.seoComparison.reduce((sum, item) => sum + item.you, 0) / analysis.seoComparison.length,
  );
  const gapCount = analysis.featureMatrix.filter((row) => !row.you).length;

  return (
    <div className="page-shell">
      <SectionHeader
        title="Competitor Intelligence"
        subtitle="Feature comparison, SEO gaps, and market positioning"
        actions={
          <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => toast.info("Enter competitor URLs in the form and run the benchmark.")}>
            <FiSearch />
            Benchmark Now
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h3 className="h4 fw-bold mb-1">Add competitor URLs</h3>
                <p className="section-kicker mb-0">Compare your site with the most relevant local and regional competitors.</p>
              </div>
              <div className="metric-icon" style={{ width: 40, height: 40 }}>
                <FiUsers size={18} />
              </div>
            </div>

            <form className="d-grid gap-3" onSubmit={handleAnalyze}>
              {urls.map((url, index) => (
                <div key={`${index}-${url}`}>
                  <label className="form-label fw-semibold">Competitor {index + 1}</label>
                  <input
                    type="url"
                    className="form-control"
                    value={url}
                    onChange={(event) => {
                      const next = [...urls];
                      next[index] = event.target.value;
                      setUrls(next);
                    }}
                  />
                </div>
              ))}
              <div className="d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={loading}>
                  {loading ? "Benchmarking..." : "Run Benchmark"}
                  <FiBarChart2 />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setUrls(fallbackCompetitors.competitors.map((item) => item.url))}
                >
                  <FiPlus className="me-1" />
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <BarChartCard
            title="SEO Comparison"
            subtitle="Relative strength across the key ranking factors"
            data={analysis.seoComparison}
            bars={[
              { dataKey: "you", name: "You", fill: "#4f46e5" },
              { dataKey: "comp1", name: "Comp 1", fill: "#10b981" },
              { dataKey: "comp2", name: "Comp 2", fill: "#f59e0b" },
              { dataKey: "comp3", name: "Comp 3", fill: "#ef4444" },
            ]}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard
            title="Competitors"
            value={analysis.competitors.length}
            trend="Tracked in the benchmark"
            tone="blue"
            icon={<FiUsers size={18} />}
            progress={analysis.competitors.length * 25}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <StatCard
            title="Feature Gaps"
            value={gapCount}
            trend="Missing capabilities"
            tone="rose"
            icon={<FiGlobe size={18} />}
            progress={Math.min(100, gapCount * 18)}
          />
        </div>
        <div className="col-12 col-sm-12 col-xl-4">
          <StatCard
            title="SEO Strength"
            value={seoAverages}
            suffix="/100"
            trend="Your average SEO score"
            tone="emerald"
            icon={<FiTarget size={18} />}
            progress={seoAverages}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h3 className="h4 fw-bold mb-1">Feature Matrix</h3>
                <p className="section-kicker mb-0">A simple yes/no comparison of capabilities customers care about.</p>
              </div>
              <StatusBadge tone="primary">Feature audit</StatusBadge>
            </div>

            <div className="table-responsive">
              <table className="table table-clean align-middle mb-0">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="text-center">You</th>
                    <th className="text-center">Comp 1</th>
                    <th className="text-center">Comp 2</th>
                    <th className="text-center">Comp 3</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.featureMatrix.map((row) => (
                    <tr key={row.feature}>
                      <td className="fw-medium">{row.feature}</td>
                      {["you", "comp1", "comp2", "comp3"].map((key) => (
                        <td key={`${row.feature}-${key}`} className="text-center fw-bold" style={{ color: row[key] ? "#10b981" : "#ef4444" }}>
                          {row[key] ? "✓" : "✕"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="surface-card p-4 h-100">
            <h3 className="h4 fw-bold mb-1">Content Gaps</h3>
            <p className="section-kicker mb-3">Where competitors are winning the attention battle.</p>
            <div className="d-grid gap-2">
              {analysis.contentGap.map((item, index) => (
                <div key={item} className="subtle-card p-3 d-flex align-items-start gap-3">
                  <div className={`action-number ${index === 0 ? "primary" : index === 1 ? "warning" : "rose"}`}>{index + 1}</div>
                  <div className="small">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

