import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiGlobe,
  FiInfo,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import InfoCard from "../../components/common/InfoCard";
import StatusBadge from "../../components/common/StatusBadge";
import LineChartCard from "../../components/charts/LineChartCard";
import { analysisApi, dashboardApi } from "../../services/api";
import { dashboardOverview, websiteAnalysis as fallbackAnalysis } from "../../data/mockData";

function mapListToBullets(items, firstSuccess = true) {
  return items.map((label, index) => ({
    label,
    status: index === 0 && firstSuccess ? "success" : index === items.length - 1 ? "danger" : "warning",
  }));
}

export default function BusinessAnalysisPage() {
  const [formData, setFormData] = useState({
    url: fallbackAnalysis.url,
    businessName: dashboardOverview.businessName,
  });
  const [analysis, setAnalysis] = useState(fallbackAnalysis);
  const [scoreHistory, setScoreHistory] = useState(dashboardOverview.scoreHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const [analysisResponse, overviewResponse] = await Promise.all([
        analysisApi.analyzeWebsite(formData),
        dashboardApi.getOverview(),
      ]);

      if (!active) {
        return;
      }

      setAnalysis(analysisResponse || fallbackAnalysis);
      setScoreHistory(overviewResponse?.scoreHistory || dashboardOverview.scoreHistory);
    };

    bootstrap();

    return () => {
      active = false;
    };
    // Intentionally run once on mount with the seeded URL.
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await analysisApi.analyzeWebsite(formData);
      setAnalysis(response || fallbackAnalysis);
      toast.success("Website analysis refreshed.");
    } catch {
      toast.error("Unable to analyze the website right now.");
    } finally {
      setLoading(false);
    }
  };

  const seoMetricCount = analysis.seoMetrics?.length || 0;
  const ctaCount = analysis.ctaFindings?.length || 0;
  const serviceCount = analysis.serviceFindings?.length || 0;
  const opportunityCount = analysis.opportunities?.length || 0;

  return (
    <div className="page-shell">
      <SectionHeader
        title="Business Analysis"
        subtitle="Website health, SEO, and lead-conversion readiness"
        actions={
          <>
            <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center gap-2" onClick={handleAnalyze}>
              <FiRefreshCw />
              Refresh Analysis
            </button>
            <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => toast.info("Download the PDF from the top-right report button.")}>
              <FiShield />
              Export Report
            </button>
          </>
        }
      />

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="surface-card p-4 h-100">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
              <div>
                <h3 className="h4 fw-bold mb-1">Analyze your website</h3>
                <p className="section-kicker mb-0">Enter a URL to generate an AI-powered site audit.</p>
              </div>
              <div className="metric-icon" style={{ width: 40, height: 40 }}>
                <FiSearch size={18} />
              </div>
            </div>

            <form className="d-grid gap-3" onSubmit={handleAnalyze}>
              <div>
                <label className="form-label fw-semibold">Business name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.businessName}
                  onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
                />
              </div>
              <div>
                <label className="form-label fw-semibold">Website URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.url}
                  onChange={(event) => setFormData((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://yourbusiness.com"
                  required
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={loading}>
                  {loading ? "Analyzing..." : "Run Analysis"}
                  <FiBarChart2 />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    setFormData({
                      businessName: dashboardOverview.businessName,
                      url: fallbackAnalysis.url,
                    })
                  }
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 subtle-card">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FiInfo className="text-secondary" />
                <div className="fw-bold">Current analysis target</div>
              </div>
              <div className="fw-semibold">{analysis.url}</div>
              <div className="small text-secondary mt-1">{analysis.subtitle}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <LineChartCard
            title="Business Health Trend"
            subtitle="How your overall score is moving over time"
            data={scoreHistory}
            lines={[{ dataKey: "value", name: "Health Score", stroke: "#4f46e5" }]}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Site Score"
            value={analysis.score}
            suffix="/100"
            trend="Overall website readiness"
            tone="primary"
            icon={<FiGlobe size={18} />}
            progress={analysis.score}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="SEO Checks"
            value={seoMetricCount}
            trend="Technical items reviewed"
            tone="blue"
            icon={<FiBarChart2 size={18} />}
            progress={Math.min(100, seoMetricCount * 15)}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="CTA Signals"
            value={ctaCount}
            trend="Lead capture opportunities"
            tone="amber"
            icon={<FiShield size={18} />}
            progress={Math.min(100, ctaCount * 20)}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Contact Signals"
            value={analysis.contactSignals?.length || 0}
            trend="Visible trust signals"
            tone="rose"
            icon={<FiAlertTriangle size={18} />}
            progress={Math.min(100, (analysis.contactSignals?.length || 0) * 25)}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="surface-card p-4 h-100">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h3 className="h4 fw-bold mb-1">SEO Metrics</h3>
                <p className="section-kicker mb-0">A quick health check across the core technical factors</p>
              </div>
              <StatusBadge tone="primary">Audit summary</StatusBadge>
            </div>

            <div className="table-responsive">
              <table className="table table-clean mb-0">
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th className="text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.seoMetrics.map((metric) => (
                    <tr key={metric.label}>
                      <td className="fw-medium">{metric.label}</td>
                      <td className="text-end text-secondary">{metric.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <InfoCard
            title="Contact Information"
            tone="emerald"
            icon={<FiCheckCircle size={16} />}
            bullets={mapListToBullets(analysis.contactSignals)}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6 col-xl-4">
          <InfoCard
            title="CTA Findings"
            tone="blue"
            icon={<FiShield size={16} />}
            bullets={mapListToBullets(analysis.ctaFindings)}
          />
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <InfoCard
            title="Service Analysis"
            tone="orange"
            icon={<FiSearch size={16} />}
            bullets={mapListToBullets(analysis.serviceFindings, false)}
          />
        </div>
        <div className="col-12 col-md-12 col-xl-4">
          <InfoCard
            title="Growth Opportunities"
            tone="violet"
            icon={<FiTrendingUp size={16} />}
            bullets={mapListToBullets(analysis.opportunities, false)}
            to="/recommendations"
          />
        </div>
      </div>
    </div>
  );
}

