"use client"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { usePathname, useRouter } from "next/navigation"
import { db } from "../../../config/firebase";
import Link from "next/link";
import "./viewOrder.css";

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

export default function ViewOrders() {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    // Detail modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    async function fetchOrder() {
        try {
            const res = await getDocs(collection(db, "orders"));
            const list = res.docs.map(d => ({ id: d.id, ...d.data() }));
            setData(list);
            setFilteredData(list);
        } catch (e) {
            console.error("Error fetching orders:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { setLoading(true); fetchOrder(); }, []);
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    useEffect(() => {
        const filtered = data.filter(order => {
            const matchSearch =
                (order.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === "all" ||
                (order.paymentStatus || "").toLowerCase() === statusFilter;
            const matchPayment = paymentFilter === "all" ||
                (order.paymentType || "").toLowerCase() === paymentFilter;
            return matchSearch && matchStatus && matchPayment;
        });
        setFilteredData(filtered);
    }, [searchTerm, statusFilter, paymentFilter, data]);

    const totalOrders    = data.length;
    const completedOrders = data.filter(o => o.paymentStatus === "completed").length;
    const pendingOrders  = data.filter(o => o.paymentStatus === "pending").length;
    const totalRevenue   = data.reduce((s, o) => s + (o.amount || 0), 0);

    const paymentTypes = ["all", ...new Set(data.map(o => o.paymentType).filter(Boolean))];

    function getStatusCls(status) {
        switch ((status || "").toLowerCase()) {
            case "completed":  return "vo-status-completed";
            case "pending":    return "vo-status-pending";
            case "processing": return "vo-status-processing";
            case "cancelled":  return "vo-status-cancelled";
            default:           return "vo-status-completed";
        }
    }

    function getStatusLabel(order) {
        if (order.paymentType === "card") return order.paymentStatus || "pending";
        return "completed";
    }

    function formatDate(ts) {
        if (!ts) return "—";
        try { return ts.toDate().toISOString().slice(0, 10); }
        catch { return "—"; }
    }

    function formatPayment(type) {
        if (!type) return "—";
        const map = { cash: "Cash", card: "Credit Card", credit: "Credit Card", debit: "Debit Card" };
        return map[type.toLowerCase()] || type;
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
                    <button className="logout-btn">🚪 Logout</button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main-content">

                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="hamburger-btn" onClick={() => setSidebarOpen(p => !p)}>☰</button>
                        <span className="page-title">Orders</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                <main className="page-body">

                    {/* Heading row */}
                    <div className="vo-heading-row">
                        <div>
                            <h1 className="vo-title">Order History</h1>
                            <p className="vo-subtitle">View and manage all customer orders</p>
                        </div>
                        <Link href="/adminDashBoard/addOrders" className="vo-add-btn">
                            + Add Sale
                        </Link>
                    </div>

                    {/* Stat cards */}
                    <div className="vo-stats-row">
                        <div className="vo-stat-card">
                            <div className="vo-stat-label">Total Orders</div>
                            <div className="vo-stat-value">{totalOrders}</div>
                        </div>
                        <div className="vo-stat-card">
                            <div className="vo-stat-label">Completed</div>
                            <div className="vo-stat-value vo-val-green">{completedOrders}</div>
                        </div>
                        <div className="vo-stat-card">
                            <div className="vo-stat-label">Pending</div>
                            <div className="vo-stat-value vo-val-amber">{pendingOrders}</div>
                        </div>
                        <div className="vo-stat-card">
                            <div className="vo-stat-label">Total Revenue</div>
                            <div className="vo-stat-value"> {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    {/* Search card */}
                    <div className="vo-search-card">
                        <span className="vo-search-icon">🔍</span>
                        <input
                            type="text"
                            className="vo-search-input"
                            placeholder="Search orders by order number, customer, or store..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="vo-filter-select"
                            value={paymentFilter}
                            onChange={e => setPaymentFilter(e.target.value)}
                        >
                            {paymentTypes.map(t => (
                                <option key={t} value={t}>
                                    {t === "all" ? "All Payments" : formatPayment(t)}
                                </option>
                            ))}
                        </select>
                        <select
                            className="vo-filter-select"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Table card */}
                    <div className="vo-table-card">
                        <div className="vo-table-heading">
                            All Orders ({filteredData.length})
                        </div>

                        {loading ? (
                            <div className="vo-loading">
                                <div className="loading-spinner" />
                                <p>Loading orders…</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="vo-empty">
                                <p>No orders found.</p>
                            </div>
                        ) : (
                            <div className="vo-table-wrap">
                                <table className="vo-table">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((order, idx) => {
                                            const statusLabel = getStatusLabel(order);
                                            const statusCls   = getStatusCls(statusLabel);
                                            const itemCount   = Array.isArray(order.items) ? order.items.length : 0;
                                            return (
                                                <tr key={order.id}>
                                                    <td className="vo-td-id">
                                                        ORD-{String(idx + 1).padStart(3, "0")}
                                                    </td>
                                                    <td>{order.customer || "Anonymous"}</td>
                                                    <td>{itemCount} {itemCount === 1 ? "item" : "items"}</td>
                                                    <td>${Number(order.amount || 0).toFixed(2)}</td>
                                                    <td>{formatDate(order.createdAt)}</td>
                                                    <td>{formatPayment(order.paymentType)}</td>
                                                    <td>
                                                        <span className={`vo-status ${statusCls}`}>
                                                            {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="vo-view-btn"
                                                            onClick={() => setSelectedOrder(order)}
                                                            title="View details"
                                                        >
                                                            👁
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </main>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="vo-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="vo-modal" onClick={e => e.stopPropagation()}>
                        <div className="vo-modal-header">
                            <div>
                                <h3>Order Details</h3>
                                <p className="vo-modal-id">#{selectedOrder.id.slice(0, 8)}</p>
                            </div>
                            <button className="vo-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
                        </div>

                        <div className="vo-modal-meta">
                            <div className="vo-meta-row">
                                <span>Customer</span>
                                <span>{selectedOrder.customer || "Anonymous"}</span>
                            </div>
                            <div className="vo-meta-row">
                                <span>Date</span>
                                <span>{formatDate(selectedOrder.createdAt)}</span>
                            </div>
                            <div className="vo-meta-row">
                                <span>Payment</span>
                                <span>{formatPayment(selectedOrder.paymentType)}</span>
                            </div>
                            <div className="vo-meta-row">
                                <span>Status</span>
                                <span className={`vo-status ${getStatusCls(getStatusLabel(selectedOrder))}`}>
                                    {getStatusLabel(selectedOrder)}
                                </span>
                            </div>
                        </div>

                        {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 && (
                            <div className="vo-modal-items">
                                <h4>Items</h4>
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="vo-modal-item">
                                        <span>{item.name}</span>
                                        <span>×{item.quantity}</span>
                                        <span>${Number(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="vo-modal-totals">
                            {selectedOrder.discount > 0 && (
                                <div className="vo-modal-total-row">
                                    <span>Discount</span>
                                    <span>− {Number(selectedOrder.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="vo-modal-total-row grand">
                                <span>Total</span>
                                <span> {Number(selectedOrder.amount || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="vo-modal-close-btn" onClick={() => setSelectedOrder(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}