"use client";
import { useState } from "react";
import { Auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./styling/adminLogin.css";

export function AdminLogin() {
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    function handleOnchange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
        setError("");
    }

    async function handleOnsubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Just sign in with Firebase Auth — no Firestore check here
            // AuthGuard on every dashboard page handles the role check
            await signInWithEmailAndPassword(Auth, data.email, data.password);
            setData({ email: "", password: "" });
            router.push("/adminDashBoard");

        } catch (err) {
            switch (err.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    setError("Invalid email or password.");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email address.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many attempts. Please try again later.");
                    break;
                default:
                    setError("Login failed. Please try again.");
            }
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
                    <button type="submit" disabled={loading}>
                        {loading ? "Authenticating..." : "Login as Admin"}
                    </button>
                </form>

                <div className="divider"><span>Navigation</span></div>

                <div className="nav-links">
                    <Link href="/login/customer" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Customer Login</span>
                            <span className="nav-link-description">Sign in as customer</span>
                        </div>
                    </Link>
                    <Link href="/login/staff" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Staff Login</span>
                            <span className="nav-link-description">Access staff portal</span>
                        </div>
                    </Link>
                    <Link href="/signup/customer" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Customer Signup</span>
                            <span className="nav-link-description">Create new account</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}