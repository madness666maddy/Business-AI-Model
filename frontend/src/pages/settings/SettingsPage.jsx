import { useState } from "react";
import { FiBell, FiGlobe, FiSave, FiShield, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { settingsApi } from "../../services/api";
import { dashboardOverview, mockAuthUser } from "../../data/mockData";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    businessName: dashboardOverview.businessName,
    website: dashboardOverview.website,
    fullName: mockAuthUser.fullName,
    email: mockAuthUser.email,
    timezone: "Asia/Calcutta",
    model: "Gemini 1.5 Flash",
    notifications: true,
    reviewAlerts: true,
    competitorAlerts: true,
    weeklyReports: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await settingsApi.saveSettings(formData);
      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Unable to save settings right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <SectionHeader
        title="Settings"
        subtitle="Business profile, AI preferences, and alert configuration"
        actions={<StatusBadge tone="primary">Production ready</StatusBadge>}
      />

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Profile" value="Complete" trend="Business identity set" tone="emerald" icon={<FiShield size={18} />} progress={100} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="AI Model" value="Gemini" trend="Enabled for chat and insights" tone="blue" icon={<FiZap size={18} />} progress={92} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Alerts" value="3" trend="Active notification rules" tone="amber" icon={<FiBell size={18} />} progress={75} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Site" value="Live" trend="Website connected" tone="primary" icon={<FiGlobe size={18} />} progress={86} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <div className="surface-card p-4 h-100">
              <h3 className="h4 fw-bold mb-3">Business profile</h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Business name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.businessName}
                    onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Website URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.website}
                    onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contact name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.fullName}
                    onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Timezone</label>
                  <select
                    className="form-select"
                    value={formData.timezone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, timezone: event.target.value }))}
                  >
                    <option value="Asia/Calcutta">Asia/Calcutta</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">AI model</label>
                  <select
                    className="form-select"
                    value={formData.model}
                    onChange={(event) => setFormData((prev) => ({ ...prev, model: event.target.value }))}
                  >
                    <option>Gemini 1.5 Flash</option>
                    <option>Gemini 1.5 Pro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="surface-card p-4 h-100">
              <h3 className="h4 fw-bold mb-3">Notifications</h3>
              <div className="d-grid gap-3">
                {[
                  { key: "notifications", label: "Enable notifications" },
                  { key: "reviewAlerts", label: "Review alerts" },
                  { key: "competitorAlerts", label: "Competitor alerts" },
                  { key: "weeklyReports", label: "Weekly reports" },
                ].map((item) => (
                  <div key={item.key} className="form-check form-switch d-flex align-items-center justify-content-between ps-0">
                    <label className="form-check-label fw-semibold" htmlFor={item.key}>
                      {item.label}
                    </label>
                    <input
                      id={item.key}
                      className="form-check-input ms-3"
                      type="checkbox"
                      checked={formData[item.key]}
                      onChange={(event) => setFormData((prev) => ({ ...prev, [item.key]: event.target.checked }))}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 subtle-card">
                <div className="fw-bold mb-2">Connected stack</div>
                <div className="d-grid gap-2">
                  <StatusBadge tone="success">FastAPI backend</StatusBadge>
                  <StatusBadge tone="primary">Gemini AI</StatusBadge>
                  <StatusBadge tone="warning">ChromaDB vector store</StatusBadge>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-4 d-inline-flex align-items-center justify-content-center gap-2" disabled={saving}>
                <FiSave />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

