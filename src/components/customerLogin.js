"use client";
import Link from "next/link";
import { useState } from "react";
import { Auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import "./styling/customerLogin.css";

export function CustomerLogin() {
    let [data, setData] = useState({ email: "", password: "" });
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");
    const router = useRouter();

    function handleOnchange(event) {
        setData({ ...data, [event.target.name]: event.target.value });
        setError(""); // Clear error when user types
    }

    async function handleOnsubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        
        console.log("Form submitted with data:", data);
        
        try {
            await signInWithEmailAndPassword(Auth, data.email, data.password);
            setData({ email: "", password: "" });
            console.log("User logged in successfully");
            console.log("Current user:", Auth.currentUser);
            router.push("/userDashBoard");
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Login in to your customer account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleOnsubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email address"
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
                        {loading ? "Logining in..." : "Login "}
                    </button>
                </form>

                <div className="divider">
                    <span>Other Login Options</span>
                </div>

                <div className="nav-links">
                    <Link href="/signup/customer" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Create Customer Account</span>
                            <span className="nav-link-description">New customer? Register here</span>
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

                    <Link href="/login/admin" className="nav-link-item">
                        <div className="nav-link-content">
                            <span className="nav-link-label">Admin Login</span>
                            <span className="nav-link-description">Administrator access</span>
                        </div>
                        {/* <span className="nav-link-arrow">→</span> */}
                    </Link>
                </div>

                {/* <div className="signup-prompt">
                    <p>Don't have an account?</p>
                    <Link href="/signup/customer" className="signup-link">
                        Create Customer Account
                    </Link> */}
                {/* </div> */}
            </div>
        </div>
    );
}