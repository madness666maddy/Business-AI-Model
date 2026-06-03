import { useEffect, useState } from "react";
import { FiUploadCloud, FiMessageSquare, FiThumbsUp, FiThumbsDown, FiMinusCircle, FiBarChart2 } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import DonutChartCard from "../../components/charts/DonutChartCard";
import LineChartCard from "../../components/charts/LineChartCard";
import BarChartCard from "../../components/charts/BarChartCard";
import InfoCard from "../../components/common/InfoCard";
import { analysisApi } from "../../services/api";
import { reviewAnalytics as fallbackReviews } from "../../data/mockData";

function toBullets(items) {
  return items.map((item, index) => ({
    label: `${item.label} (${item.value}%)`,
    status: index === 0 ? "success" : index === items.length - 1 ? "danger" : "warning",
  }));
}

export default function ReviewAnalyticsPage() {
  const [analysis, setAnalysis] = useState(fallbackReviews);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    analysisApi.analyzeReviews(new FormData()).then((data) => {
      if (active && data) {
        setAnalysis(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.info("No CSV selected. Showing the sample review dataset.");
      setAnalysis(fallbackReviews);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await analysisApi.analyzeReviews(formData);
      setAnalysis(response || fallbackReviews);
      toast.success("Review file analyzed.");
    } catch {
      toast.error("Unable to process the review file right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <SectionHeader
        title="Review Analytics"
        subtitle="Sentiment analysis, complaint detection, and topic extraction"
        actions={
          <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => toast.info("Upload a Google Reviews CSV from the form below.")}>
            <FiMessageSquare />
            Review Insights
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h3 className="h4 fw-bold mb-1">Upload review CSV</h3>
                <p className="section-kicker mb-0">Analyze Google review exports and extract actionable themes.</p>
              </div>
              <div className="metric-icon" style={{ width: 40, height: 40 }}>
                <FiUploadCloud size={18} />
              </div>
            </div>

            <form className="d-grid gap-3" onSubmit={handleUpload}>
              <div>
                <label className="form-label fw-semibold">Google Reviews CSV</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".csv"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </div>
              <button type="submit" className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Reviews"}
                <FiBarChart2 />
              </button>
            </form>

            <div className="mt-4 row g-3">
              <div className="col-12 col-md-4">
                <StatCard
                  title="Positive"
                  value={analysis.sentimentBreakdown[0].value}
                  suffix="%"
                  trend="Customer praise"
                  tone="emerald"
                  icon={<FiThumbsUp size={18} />}
                  progress={analysis.sentimentBreakdown[0].value}
                />
              </div>
              <div className="col-12 col-md-4">
                <StatCard
                  title="Neutral"
                  value={analysis.sentimentBreakdown[1].value}
                  suffix="%"
                  trend="Mixed feedback"
                  tone="amber"
                  icon={<FiMinusCircle size={18} />}
                  progress={analysis.sentimentBreakdown[1].value}
                />
              </div>
              <div className="col-12 col-md-4">
                <StatCard
                  title="Negative"
                  value={analysis.sentimentBreakdown[2].value}
                  suffix="%"
                  trend="Complaint rate"
                  tone="rose"
                  icon={<FiThumbsDown size={18} />}
                  progress={analysis.sentimentBreakdown[2].value}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <DonutChartCard
            title="Sentiment Breakdown"
            subtitle="Distribution across the uploaded review set"
            data={analysis.sentimentBreakdown}
            centerValue={analysis.totalReviews}
            centerLabel="Reviews"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <LineChartCard
            title="Sentiment Trend"
            subtitle="How customer sentiment is changing over time"
            data={analysis.trend.map((row) => ({
              month: row.month,
              Positive: row.positive,
              Neutral: row.neutral,
              Negative: row.negative,
            }))}
            lines={[
              { dataKey: "Positive", name: "Positive", stroke: "#10b981" },
              { dataKey: "Neutral", name: "Neutral", stroke: "#f59e0b" },
              { dataKey: "Negative", name: "Negative", stroke: "#ef4444" },
            ]}
          />
        </div>
        <div className="col-12 col-xl-6">
          <BarChartCard
            title="Topic Extraction"
            subtitle="Themes surfaced from review text"
            data={analysis.topics}
            bars={[{ dataKey: "score", name: "Topic Score", fill: "#4f46e5" }]}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <InfoCard
            title="Top Complaints"
            tone="rose"
            icon={<FiThumbsDown size={16} />}
            bullets={toBullets(analysis.topComplaints)}
          />
        </div>
        <div className="col-12 col-xl-6">
          <InfoCard
            title="Top Praises"
            tone="emerald"
            icon={<FiThumbsUp size={16} />}
            bullets={toBullets(analysis.topPraises)}
          />
        </div>
      </div>
    </div>
  );
}
