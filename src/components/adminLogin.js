"use client";
import { useState } from "react";
import { Auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./styling/adminLogin.css";

export function AdminLogin() {
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
            router.push("/adminDashBoard");
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid admin credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-wrapper">
            <div className="admin-card">
                <h1 className="admin-title">Admin Access</h1>
                <p className="admin-subtitle">Secure administrator login portal</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleOnsubmit} className="admin-form">
                    <input
                        type="email"
                        placeholder="Admin email"
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
                        {loading ? "Authenticating..." : "Login as Admin"}
                    </button>
                </form>

                <div className="divider">
                    <span>Navigation</span>
                </div>

                <div className="nav-links">
                    <Link href="/login/customer" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Customer Login</span>
                            <span className="nav-link-description">Sign in as customer</span>
                        </div>
                        {/* <span className="nav-link-arrow">→</span> */}
                    </Link>

                    <Link href="/login/staff" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Staff Login</span>
                            <span className="nav-link-description">Access staff portal</span>
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
                    <p>Need an admin account?</p>
                    <Link href="/signup/admin" className="signup-link">
                        Contact Super Admin
                    </Link>
                </div> */}
            </div>
        </div>
    );
}