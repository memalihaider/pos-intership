"use client"
import { db } from "../../../config/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./viewProduct.css";

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

export default function ViewProducts() {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    async function fetchProducts() {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "product"));
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setProducts(list);
            setFilteredProducts(list);
        } catch (e) {
            console.error("Error fetching products:", e);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProduct() {
        if (!productToDelete) return;
        try {
            await deleteDoc(doc(db, "product", productToDelete));
            await fetchProducts();
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (e) {
            console.error("Error deleting product:", e);
        }
    }

    function handleDeleteClick(id) {
        setProductToDelete(id);
        setShowDeleteModal(true);
    }

    useEffect(() => {
        const filtered = products.filter(p => {
            const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = categoryFilter === "all" || p.category === categoryFilter;
            return matchSearch && matchCat;
        });
        setFilteredProducts(filtered);
    }, [searchTerm, categoryFilter, products]);

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

    function getStatus(stock) {
        if (stock === 0) return { label: "Out of Stock", cls: "status-out" };
        if (stock < 10)  return { label: "Low Stock",    cls: "status-low" };
        return               { label: "In Stock",        cls: "status-in" };
    }

    if (loading) {
        return (
            <div className="pos-shell">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading products…</p>
                </div>
            </div>
        );
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
                        <span className="page-title">Products</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                {/* Page Body */}
                <main className="page-body">

                    {/* Page Heading Row */}
                    <div className="vp-heading-row">
                        <div>
                            <h1 className="vp-title">Product &amp; Inventory Management</h1>
                            <p className="vp-subtitle">Track and manage your product inventory</p>
                        </div>
                        <Link href="/adminDashBoard/addProduct" className="vp-add-btn">
                            + Add Product
                        </Link>
                    </div>

                    {/* Search bar card */}
                    <div className="vp-search-card">
                        <span className="vp-search-icon">🔍</span>
                        <input
                            type="text"
                            className="vp-search-input"
                            placeholder="Search products by name, SKU, or category..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="vp-filter-select"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>
                                    {c === "all" ? "All Categories" : c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Table card */}
                    <div className="vp-table-card">
                        <div className="vp-table-heading">
                            All Products ({filteredProducts.length})
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="vp-empty">
                                <p>No products found.</p>
                                {!searchTerm && (
                                    <Link href="/adminDashBoard/addProduct" className="vp-add-btn" style={{ marginTop: 12 }}>
                                        Add Your First Product
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="vp-table-wrap">
                                <table className="vp-table">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>SKU</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Reorder Level</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(item => {
                                            const status = getStatus(item.stock || 0);
                                            return (
                                                <tr key={item.id}>
                                                    <td className="td-name">{item.name}</td>
                                                    <td className="td-sku">{item.sku || item.id?.slice(0, 6).toUpperCase()}</td>
                                                    <td>{item.category || "—"}</td>
                                                    <td> {Number(item.price || 0).toFixed(2)}</td>
                                                    <td>{item.stock ?? 0}</td>
                                                    <td>{item.reorderLevel ?? "—"}</td>
                                                    <td>
                                                        <span className={`vp-status ${status.cls}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="vp-actions">
                                                            <Link
                                                                href={`/adminDashBoard/viewProducts/${item.id}`}
                                                                className="vp-edit-btn"
                                                                title="Edit"
                                                            >
                                                                ✎
                                                            </Link>
                                                            <button
                                                                className="vp-delete-btn"
                                                                onClick={() => handleDeleteClick(item.id)}
                                                                title="Delete"
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
                        <h3 className="modal-title">Delete Product</h3>
                        <p className="modal-msg">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="modal-btns">
                            <button className="modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="modal-confirm" onClick={deleteProduct}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}