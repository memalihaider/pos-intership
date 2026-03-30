"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SalesChart from "../../components/salesChart";
import ProductSalesChart from "../../components/productChart";
import PaymentTypeChart from "@/components/paymentType";
import RevenueChart from "@/components/revenue";
import "./adminStyling.css";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import {useLogout} from "../../components/useLogout"


const navItems = [
    { label: "Dashboard",        href: "/adminDashBoard" },
    { label: "Sales & Checkout", href: "/adminDashBoard/addOrders" },
    { label: "Products",         href: "/adminDashBoard/viewProducts" },
    // { label: "Customers",        href: "/adminDashBoard/viewCustomers" },
    { label: "Orders",           href: "/adminDashBoard/viewOrders" },
    { label: "Users & Roles",    href: "/adminDashBoard/viewStaff" },
    // { label: "Stores",           href: "/adminDashBoard/stores" },
    // { label: "Inventory History",href: "/adminDashBoard/inventory" },
    // { label: "Reports",          href: "/adminDashBoard/reports" },
];

export default function AdminDashBoard() {
    let logoout = useLogout();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0, orders: 0, staff: 0, users: 0,
        revenue: 0, pendingOrders: 0, lowStock: 0
    });

    async function fetchStats() {
        setLoading(true);
        try {
            const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
                getDocs(collection(db, "orders")),
                getDocs(collection(db, "product")),
                getDocs(collection(db, "users")),
            ]);

            const staffCount = usersSnap.docs.filter(d => d.data().role === "staff").length;
            let totalRevenue = 0, pendingOrders = 0;

            ordersSnap.docs.forEach(d => {
                const o = d.data();
                totalRevenue += o.amount || 0;
                if (o.paymentStatus === "pending" || o.status === "pending") pendingOrders++;
            });

            const lowStockCount = productsSnap.docs.filter(d => (d.data().stock || 0) < 10).length;

            setStats({
                products: productsSnap.size, orders: ordersSnap.size,
                staff: staffCount, users: usersSnap.size,
                revenue:Math.ceil(totalRevenue), pendingOrders, lowStock: lowStockCount
            });
        } catch (e) {
            console.error("Error fetching stats:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchStats(); }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const formatCurrency = (n) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(n);

    if (loading) {
        return (
            <div className="pos-shell">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading dashboard…</p>
                </div>
            </div>
        );
    }
    

    return (
        
        <div className="pos-shell">

            {/* Overlay — only rendered when sidebar is open on mobile */}
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
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? "active" : ""}`}
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
                    <button className="logout-btn" onClick={logoout}>🚪 Logout</button>
                </div>

            </aside>

            {/* MAIN CONTENT */}
            <div className="main-content">

                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(prev => !prev)}
                        >
                            ☰
                        </button>
                        <span className="page-title">Dashboard</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                {/* Page Body */}
                <main className="page-body">

                    {/* Stat Cards */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-card-label">Total Revenue</span>
                                <div className="stat-card-icon" style={{ background: "#ede9fe" }}>💰</div>
                            </div>
                            <div className="stat-card-value">{stats.revenue}</div>
                            {/* <div className="stat-card-delta delta-up">↑ +20.7% from last month</div> */}
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-card-label">Orders</span>
                                <div className="stat-card-icon" style={{ background: "#dbeafe" }}>🛒</div>
                            </div>
                            <div className="stat-card-value">{stats.orders.toLocaleString()}</div>
                            {/* <div className="stat-card-delta delta-up">↑ +15.3% from last month</div> */}
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-card-label">Customers</span>
                                <div className="stat-card-icon" style={{ background: "#dcfce7" }}>👥</div>
                            </div>
                            <div className="stat-card-value">{stats.users.toLocaleString()}</div>
                            {/* <div className="stat-card-delta delta-up">↑ +12.5% from last month</div> */}
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-card-label">Products</span>
                                <div className="stat-card-icon" style={{ background: "#fef3c7" }}>📦</div>
                            </div>
                            <div className="stat-card-value">{stats.products.toLocaleString()}</div>
                            <div className={`stat-card-delta ${stats.lowStock > 0 ? "delta-down" : "delta-up"}`}>
                                {/* {stats.lowStock > 0 ? "↓ -2.4% from last month" : "↑ +0% from last month"} */}
                            </div>
                        </div>
                    </div>

                    {/* Charts Top Row */}
                    <div className="charts-top-row">
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <span className="chart-card-title">Sales Overview</span>
                                <span className="chart-period">Last 7 days</span>
                            </div>
                            <div className="chart-inner">
                                <PaymentTypeChart />
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-card-header">
                                <span className="chart-card-title">Sales by Dates</span>
                                <span className="chart-period">This month</span>
                            </div>
                            <div className="chart-inner">
                                <ProductSalesChart />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="charts-bottom-row">
                        <div className="chart-card full-width">
                            <div className="chart-card-header">
                                <span className="chart-card-title">Revenue Trend</span>
                                <span className="chart-period">Last 7 days</span>
                            </div>
                            <div className="chart-inner">
                                <SalesChart />
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
        
    );
}