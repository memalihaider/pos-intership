"use client"
import { useState, useEffect } from "react"
import { Auth, db } from "../../../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./addStaff.css";

const navItems = [
    { label: "Dashboard",         href: "/adminDashBoard" },
    { label: "Sales & Checkout",  href: "/adminDashBoard/addOrders" },
    { label: "Products",          href: "/adminDashBoard/viewProducts" },
    // { label: "Customers",         href: "/adminDashBoard/viewCustomers" },
    { label: "Orders",            href: "/adminDashBoard/viewOrders" },
    { label: "Users & Roles",     href: "/adminDashBoard/viewStaff" },
    // { label: "Stores",            href: "/adminDashBoard/stores" },
    // { label: "Inventory History", href: "/adminDashBoard/inventory" },
    // { label: "Reports",           href: "/adminDashBoard/reports" },
];

export default function AddStaff() {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    function handleOnChange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
        setError("");
    }

    const getPasswordStrength = () => {
        const p = data.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (p.match(/[a-z]/) && p.match(/[A-Z]/)) s++;
        if (p.match(/[0-9]/)) s++;
        if (p.match(/[^a-zA-Z0-9]/)) s++;
        return s;
    };

    const strength = getPasswordStrength();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] || "";
    const strengthCls   = ["", "as-weak", "as-fair", "as-good", "as-strong"][strength] || "";

    async function handleSubmit(e) {
        e.preventDefault();
        if (data.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const cred = await createUserWithEmailAndPassword(Auth, data.email, data.password);
            await setDoc(doc(db, "users", cred.user.uid), {
                email: data.email,
                role: "staff",
                status: "active",
                createdAt: new Date()
            });
            setSuccess(true);
            setData({ email: "", password: "" });
            setTimeout(() => router.push("/adminDashBoard/viewStaff"), 2000);
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use': setError("Email already in use."); break;
                case 'auth/invalid-email':        setError("Invalid email address."); break;
                case 'auth/weak-password':        setError("Password is too weak."); break;
                default: setError("Failed to create staff account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="pos-shell">

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">⚙️</div>
                    <span className="sidebar-logo-text">POS System</span>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`nav-item ${item.href === "/adminDashBoard/viewStaff" ? "active" : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">U</div>
                        <div className="user-info">
                            <div className="user-email">umarshah6444@g…</div>
                            <div className="user-role">Admin</div>
                        </div>
                    </div>
                    <button className="logout-btn">🚪 Logout</button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main-content">

                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="hamburger-btn" onClick={() => setSidebarOpen(p => !p)}>☰</button>
                        <span className="page-title">Users &amp; Roles</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                <div className="as-heading-row">
                        <div>
                            <h1 className="as-title">Add New Staff Member</h1>
                            <p className="as-subtitle">Create a new staff account with login credentials</p>
                        </div>
                        <Link href="/adminDashBoard/viewStaff" className="as-back-btn">
                            Back to Users
                        </Link>
                    </div>

                <main className="page-body">

                    {/* Heading row */}

                    {/* Alerts */}
                    {success && (
                        <div className="as-alert as-alert-success">
                            ✅ Staff account created successfully! Redirecting…
                        </div>
                    )}
                    {error && (
                        <div className="as-alert as-alert-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="as-card">

                        {/* Role badge */}
                        <div className="as-role-badge">
                            👥 Staff Member
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Account Information */}
                            <div className="as-section">
                                <h3 className="as-section-title">Account Information</h3>

                                <div className="as-row">
                                    {/* Email */}
                                    <div className="as-group">
                                        <label className="as-label">Email Address *</label>
                                        <div className="as-input-wrap">
                                            <span className="as-input-icon">✉️</span>
                                            <input
                                                className="as-input"
                                                type="email"
                                                name="email"
                                                placeholder="staff@example.com"
                                                value={data.email}
                                                onChange={handleOnChange}
                                                required
                                            />
                                        </div>
                                        <span className="as-helper">Staff will use this email to login</span>
                                    </div>

                                    {/* Password */}
                                    <div className="as-group">
                                        <label className="as-label">Password *</label>
                                        <div className="as-input-wrap">
                                            <span className="as-input-icon">🔒</span>
                                            <input
                                                className="as-input"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter secure password"
                                                value={data.password}
                                                onChange={handleOnChange}
                                                required
                                                minLength="6"
                                            />
                                            <button
                                                type="button"
                                                className="as-toggle-pw"
                                                onClick={() => setShowPassword(p => !p)}
                                            >
                                                {showPassword ? "🙈" : "👁"}
                                            </button>
                                        </div>

                                        {/* Strength bar */}
                                        {data.password && (
                                            <div className="as-strength">
                                                <div className="as-strength-track">
                                                    <div
                                                        className={`as-strength-fill ${strengthCls}`}
                                                        style={{ width: `${(strength / 4) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={`as-strength-label ${strengthCls}`}>
                                                    {strengthLabel}
                                                </span>
                                            </div>
                                        )}
                                        <span className="as-helper">Min. 6 characters. Mix letters, numbers &amp; symbols.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="as-actions">
                                <button
                                    type="submit"
                                    className="as-save-btn"
                                    disabled={loading || success}
                                >
                                    {loading ? "Creating Account…" : "Add Staff Member"}
                                </button>
                                <Link href="/adminDashBoard/viewStaff" className="as-cancel-btn">
                                    Cancel
                                </Link>
                            </div>

                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}