"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { db, auth } from "../../../config/firebase"
import { deleteUser } from "firebase/auth"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link"
import "./viewStaff.css"

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

export default function ShowStaff() {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    async function fetchStaff() {
        setLoading(true);
        try {
            // Fetch ALL users (staff + others) to match the Figma "All Users" view
            const snap = await getDocs(collection(db, "users"));
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setData(list);
            setFilteredData(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchStaff(); }, []);
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    useEffect(() => {
        const filtered = data.filter(staff => {
            const matchSearch =
                staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.role?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active"   && staff.status !== "inactive") ||
                (statusFilter === "inactive" && staff.status === "inactive");
            return matchSearch && matchStatus;
        });
        setFilteredData(filtered);
    }, [searchTerm, statusFilter, data]);

    async function handleDeleteStaff() {
        if (!staffToDelete) return;
        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, "users", staffToDelete));
            await fetchStaff();
            setShowDeleteModal(false);
            setStaffToDelete(null);
        } catch (e) {
            console.error("Error deleting staff:", e);
        } finally {
            setDeleteLoading(false);
        }
    }

    const formatDate = (ts) => {
        if (!ts) return "—";
        try {
            const d = ts.toDate ? ts.toDate() : new Date(ts);
            return d.toLocaleDateString();
        } catch { return "—"; }
    };

    function getRoleBadgeCls(role) {
        switch ((role || "").toLowerCase()) {
            case "admin":    return "role-admin";
            case "staff":    return "role-staff";
            case "customer": return "role-customer";
            default:         return "role-staff";
        }
    }

    function getRoleLabel(role) {
        if (!role) return "Staff";
        return role.charAt(0).toUpperCase() + role.slice(1);
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
                        <span className="page-title">Users &amp; Roles</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                <main className="page-body">

                    {/* Heading row */}
                    <div className="vs-heading-row">
                        <div>
                            <h1 className="vs-title">User &amp; Role Management</h1>
                            <p className="vs-subtitle">Manage system users and their access levels</p>
                        </div>
                        <button
                            className="vs-add-btn"
                            onClick={() => router.push("/adminDashBoard/addStaff")}
                        >
                            + Add Staff
                        </button>
                    </div>

                    {/* Search card */}
                    <div className="vs-search-card">
                        <span className="vs-search-icon">🔍</span>
                        <input
                            type="text"
                            className="vs-search-input"
                            placeholder="Search users by name, email, or role..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="vs-filter-select"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Table card */}
                    <div className="vs-table-card">
                        <div className="vs-table-heading">
                            All Users ({filteredData.length})
                        </div>

                        {loading ? (
                            <div className="vs-loading">
                                <div className="loading-spinner" />
                                <p>Loading users…</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="vs-empty">
                                <p>No users found.</p>
                                {!searchTerm && (
                                    <button className="vs-add-btn" style={{ marginTop: 12 }} onClick={() => router.push("/adminDashBoard/addStaff")}>
                                        Add Staff Member
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="vs-table-wrap">
                                <table className="vs-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Store</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(item => {
                                            const isActive = item.status !== "inactive";
                                            return (
                                                <tr key={item.id}>
                                                    <td className="vs-td-name">
                                                        {item.displayName || item.email?.split("@")[0] || "—"}
                                                    </td>
                                                    <td className="vs-td-email">{item.email || "—"}</td>
                                                    <td>
                                                        <span className={`vs-role-badge ${getRoleBadgeCls(item.role)}`}>
                                                            {getRoleLabel(item.role)}
                                                        </span>
                                                    </td>
                                                    <td>{item.store || "—"}</td>
                                                    <td>
                                                        <span className={`vs-status ${isActive ? "vs-status-active" : "vs-status-inactive"}`}>
                                                            {isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="vs-actions">
                                                            {/* <button className="vs-edit-btn" title="Edit">✎</button> */}
                                                            <button
                                                                className="vs-delete-btn"
                                                                title="Delete"
                                                                onClick={() => {
                                                                    setStaffToDelete(item.id);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>
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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">⚠️</div>
                        <h3 className="modal-title">Delete Staff Member</h3>
                        <p className="modal-msg">Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="modal-btns">
                            <button className="modal-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>Cancel</button>
                            <button className="modal-confirm" onClick={handleDeleteStaff} disabled={deleteLoading}>
                                {deleteLoading ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}