import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "john@demobusiness.com",
    password: "Password123!",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success("Welcome back. Your dashboard is ready.");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your business growth dashboard and continue your analysis."
      footer={
        <div className="text-center small text-secondary">
          New here?{" "}
          <Link to="/register" className="fw-bold" style={{ color: "var(--abga-primary)" }}>
            Create an account
          </Link>
        </div>
      }
    >
      <form className="d-grid gap-3" onSubmit={handleSubmit}>
        <div>
          <label className="form-label fw-semibold">Email address</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><FiMail /></span>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="name@company.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="form-label fw-semibold">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><FiLock /></span>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Password"
              required
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
            <label className="form-check-label small" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <button type="button" className="btn btn-link p-0 small fw-bold text-decoration-none" style={{ color: "var(--abga-primary)" }}>
            Forgot password?
          </button>
        </div>
        <button type="submit" className="btn btn-primary btn-lg d-inline-flex align-items-center justify-content-center gap-2" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          <FiArrowRight />
        </button>
      </form>
    </AuthLayout>
  );
}

