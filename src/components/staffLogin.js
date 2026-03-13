"user client";
import { useState } from "react";
import { Auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./styling/staffLogin.css";

export function StaffLogin() {
  let [data, setData] = useState({ email: "", password: "" });
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  const router = useRouter();

  function handleOnchange(event) {
    setData({ ...data, [event.target.name]: event.target.value });
    setError("");
  }

  async function handleOnsubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(Auth, data.email, data.password);
      setData({ email: "", password: "" });
      router.push("/staffDashBoard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid staff credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="staff-wrapper">
      <div className="staff-card">
        <div className="staff-badge">EMPLOYEE PORTAL</div>
        <h1 className="staff-title">Staff Login</h1>
        <p className="staff-subtitle">Access your work dashboard</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleOnsubmit} className="staff-form">
          <input
            type="email"
            placeholder="Work email"
            name="email"
            value={data.email}
            onChange={handleOnchange}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleOnchange}
            required
          />

          {/* <div className="forgot-password">
            <Link href="/forgot-password">Forgot password?</Link>
          </div> */}

          <button type="submit" className={loading ? "loading" : ""}>
            {loading ? "Authenticating..." : "Staff Login"}
          </button>
        </form>

        <div className="divider">
          <span>Quick Access</span>
        </div>

        <div className="nav-links">
          <Link href="/login/customer" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Customer Login</span>
              <span className="nav-link-description">Sign in as customer</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>

          <Link href="/login/admin" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Admin Login</span>
              <span className="nav-link-description">Administrator access</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>

          <Link href="/signup/customer" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Customer Signup</span>
              <span className="nav-link-description">Create new account</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>
        </div>

        {/* <div className="signup-prompt">
          <p>New staff member?</p>
          <Link href="/signup/staff" className="signup-link">
            Request Account
          </Link>
        </div> */}
      </div>
    </div>
  );
}