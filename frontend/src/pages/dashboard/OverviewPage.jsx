import { useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiGlobe, FiMessageSquare, FiSearch, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { analysisApi } from "../../services/api";

function emptyAnalysis(url = "") {
  return {
    url,
    score: 0,
    subtitle: "Enter a website link to generate a simple growth audit.",
    seoMetrics: [],
    contactSignals: [],
    ctaFindings: [],
    serviceFindings: [],
    opportunities: [],
  };
}

export default function OverviewPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    url: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!formData.url.trim()) {
      toast.info("Add a website URL to start the analysis.");
      return;
    }

    setLoading(true);

    try {
      const response = await analysisApi.analyzeWebsite(formData);
      setAnalysis(response || emptyAnalysis(formData.url));
      toast.success("Website analysis ready.");
    } catch {
      setAnalysis(emptyAnalysis(formData.url));
      toast.error("Unable to analyze the website right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <SectionHeader
        title="Website Growth Analysis"
        subtitle="Phase 1 focuses on one clear flow: paste a website link, review the growth signals, and move to advisor chat."
        actions={
          <Link to="/ai-chat" className="btn btn-primary d-inline-flex align-items-center gap-2">
            Open Chat
            <FiArrowRight />
          </Link>
        }
      />

      <div className="surface-card p-4 mb-4">
        <div className="row g-4 align-items-end">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">Business name</label>
            <input
              type="text"
              className="form-control"
              value={formData.businessName}
              onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
              placeholder="Your business name"
            />
          </div>
          <div className="col-12 col-lg-6">
            <label className="form-label fw-semibold">Website link</label>
            <input
              type="url"
              className="form-control"
              value={formData.url}
              onChange={(event) => setFormData((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://yourbusiness.com"
            />
          </div>
          <div className="col-12 col-lg-2">
            <button type="button" className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2" onClick={handleAnalyze} disabled={loading}>
              <FiSearch />
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <div className="section-kicker mb-1">Current audit</div>
                <h3 className="h5 fw-bold mb-1">{analysis?.url || "No website analyzed yet"}</h3>
                <p className="text-secondary mb-0">{analysis?.subtitle || "The analysis will appear here after you submit a link."}</p>
              </div>
              <StatusBadge tone="primary">{analysis ? `${analysis.score}/100` : "Ready"}</StatusBadge>
            </div>

            {analysis ? (
              <>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="metric-icon" style={{ width: 40, height: 40 }}>
                    <FiGlobe size={18} />
                  </div>
                  <div>
                    <div className="small text-uppercase text-secondary fw-bold">Growth score</div>
                    <div className="h3 fw-bold mb-0">{analysis.score}/100</div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <div className="subtle-card p-3 d-flex justify-content-between align-items-center">
                    <span className="text-secondary">SEO checks</span>
                    <strong>{analysis.seoMetrics.length}</strong>
                  </div>
                  <div className="subtle-card p-3 d-flex justify-content-between align-items-center">
                    <span className="text-secondary">CTA signals</span>
                    <strong>{analysis.ctaFindings.length}</strong>
                  </div>
                  <div className="subtle-card p-3 d-flex justify-content-between align-items-center">
                    <span className="text-secondary">Opportunities</span>
                    <strong>{analysis.opportunities.length}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="alert alert-light border mb-0">
                <div className="fw-bold mb-1">Start simple</div>
                <div className="text-secondary mb-0">
                  Paste one website link and the assistant will generate a clean, actionable growth summary.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="surface-card p-4 h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div>
                <div className="section-kicker mb-1">Website signals</div>
                <h3 className="h5 fw-bold mb-0">What the site is doing well and where it needs work</h3>
              </div>
              <StatusBadge tone="muted">Simple phase 1 view</StatusBadge>
            </div>

            {analysis ? (
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="surface-card-soft p-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <FiCheckCircle className="text-success" />
                      <strong>SEO metrics</strong>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-clean mb-0">
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

                <div className="col-12 col-lg-6">
                  <div className="surface-card-soft p-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <FiAlertTriangle className="text-warning" />
                      <strong>Signals to improve</strong>
                    </div>
                    <div className="d-grid gap-2">
                      {analysis.contactSignals.map((item) => (
                        <div key={item} className="subtle-card p-2">
                          {item}
                        </div>
                      ))}
                      {analysis.ctaFindings.map((item) => (
                        <div key={item} className="subtle-card p-2">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="surface-card-soft p-3">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <FiTrendingUp className="text-primary" />
                      <strong>Growth opportunities</strong>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {analysis.opportunities.map((item) => (
                        <span key={item} className="pill-badge muted">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-light border mb-0">
                No results yet. Once you submit a website link, the core signals will appear here.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="surface-card p-4 mt-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="section-kicker mb-1">Next step</div>
            <h3 className="h5 fw-bold mb-0">Use chat to ask what to fix first and why it matters</h3>
          </div>
          <Link to="/ai-chat" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
            <FiMessageSquare />
            Go to chat
          </Link>
        </div>
      </div>
    </div>
  );
}
