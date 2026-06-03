import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiLock, FiMail, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "John Smith",
    businessName: "Demo Business",
    email: "john@demobusiness.com",
    password: "Password123!",
    confirmPassword: "Password123!",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success("Your account is ready.");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Unable to register right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up a new business workspace and start turning insights into growth."
      footer={
        <div className="text-center small text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold" style={{ color: "var(--abga-primary)" }}>
            Sign in
          </Link>
        </div>
      }
    >
      <form className="d-grid gap-3" onSubmit={handleSubmit}>
        <div>
          <label className="form-label fw-semibold">Full name</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><FiUser /></span>
            <input
              type="text"
              className="form-control"
              value={formData.fullName}
              onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="form-label fw-semibold">Business name</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><FiBriefcase /></span>
            <input
              type="text"
              className="form-control"
              value={formData.businessName}
              onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="form-label fw-semibold">Email address</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><FiMail /></span>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><FiLock /></span>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Confirm password</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><FiLock /></span>
              <input
                type="password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg d-inline-flex align-items-center justify-content-center gap-2" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
          <FiArrowRight />
        </button>
      </form>
    </AuthLayout>
  );
}

