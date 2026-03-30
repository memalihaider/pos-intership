"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { db } from "../../../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./editProduct.css";

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

export default function Dynamic({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        name: "", category: "", price: 0, discount: 0,
        stock: 0, colour: "", size: "", imageUrl: "", barcode: "", createdAt: ""
    });
    const [originalData, setOriginalData] = useState({});

    async function getProduct() {
        setFetchLoading(true);
        try {
            const ref = doc(db, "product", id);
            const snap = await getDoc(ref);
            if (!snap.exists()) { setError("Product not found"); return; }
            const productData = snap.data();
            setOriginalData(productData);
            setData(prev => ({ ...prev, ...productData }));
        } catch (e) {
            console.error("Error fetching product:", e);
            setError("Failed to load product");
        } finally {
            setFetchLoading(false);
        }
    }

    useEffect(() => { getProduct(); }, [id]);
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    function handleInputChange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            await updateDoc(doc(db, "product", id), {
                name: data.name, category: data.category,
                price: Number(data.price), discount: Number(data.discount),
                stock: Number(data.stock), colour: data.colour,
                size: data.size, barcode: data.barcode,
                imageUrl: data.imageUrl, updatedAt: Date.now()
            });
            setSuccess(true);
            setTimeout(() => router.push("/adminDashBoard/viewProducts"), 1500);
        } catch (e) {
            console.error("Error updating product:", e);
            setError("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const hasChanges = () => JSON.stringify(data) !== JSON.stringify(originalData);

    /* ── Loading screen ── */
    if (fetchLoading) {
        return (
            <div className="pos-shell">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading product details…</p>
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
                            className={`nav-item ${pathname === item.href || pathname.startsWith("/adminDashBoard/viewProducts") ? (item.href === "/adminDashBoard/viewProducts" ? "active" : "") : ""}`}
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

                    {/* Heading row */}
                    <div className="ep-heading-row">
                        <div>
                            <h1 className="ep-title">Edit Product</h1>
                            <p className="ep-subtitle">Update product information and inventory details</p>
                        </div>
                        <div className="ep-id-badge">
                            ID: {id.slice(0, 8)}…
                        </div>
                    </div>

                    {/* Alerts */}
                    {success && (
                        <div className="ep-alert ep-alert-success">
                            ✅ Product updated successfully! Redirecting…
                        </div>
                    )}
                    {error && (
                        <div className="ep-alert ep-alert-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="ep-card">
                        <form onSubmit={handleSubmit}>

                            {/* Section: Basic Info */}
                            <div className="ep-section">
                                <h3 className="ep-section-title">Basic Information</h3>
                                <div className="ep-row">
                                    <div className="ep-group">
                                        <label className="ep-label">Product Name *</label>
                                        <input
                                            className="ep-input"
                                            type="text"
                                            name="name"
                                            placeholder="e.g., Cotton T-Shirt"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="ep-group">
                                        <label className="ep-label">Category</label>
                                        <input
                                            className="ep-input"
                                            type="text"
                                            name="category"
                                            placeholder="e.g., Apparel"
                                            value={data.category}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="ep-group">
                                        <label className="ep-label">Barcode</label>
                                        <input
                                            className="ep-input"
                                            type="text"
                                            name="barcode"
                                            placeholder="e.g., 123456789"
                                            value={data.barcode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Pricing & Inventory */}
                            <div className="ep-section">
                                <h3 className="ep-section-title">Pricing &amp; Inventory</h3>
                                <div className="ep-row">
                                    <div className="ep-group">
                                        <label className="ep-label">Price ($)</label>
                                        <input
                                            className="ep-input"
                                            type="number"
                                            name="price"
                                            placeholder="0.00"
                                            min={0} step="0.01"
                                            value={data.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="ep-group">
                                        <label className="ep-label">Discount (%)</label>
                                        <input
                                            className="ep-input"
                                            type="number"
                                            name="discount"
                                            placeholder="0"
                                            min={0} max={100}
                                            value={data.discount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="ep-group">
                                        <label className="ep-label">Stock</label>
                                        <input
                                            className="ep-input"
                                            type="number"
                                            name="stock"
                                            placeholder="0"
                                            min={0}
                                            value={data.stock}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Product Details */}
                            <div className="ep-section">
                                <h3 className="ep-section-title">Product Details</h3>
                                <div className="ep-row">
                                    <div className="ep-group">
                                        <label className="ep-label">Colour</label>
                                        <input
                                            className="ep-input"
                                            type="text"
                                            name="colour"
                                            placeholder="e.g., Red, Blue"
                                            value={data.colour}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="ep-group">
                                        <label className="ep-label">Size</label>
                                        <select
                                            className="ep-input"
                                            name="size"
                                            value={data.size}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Size</option>
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                            <option value="xl">X-Large</option>
                                            <option value="xxl">XX-Large</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Media */}
                            {/* <div className="ep-section">
                                <h3 className="ep-section-title">Product Media</h3>
                                <div className="ep-group" style={{ maxWidth: 400 }}>
                                    <label className="ep-label">Product Image URL</label>
                                    <input
                                        className="ep-input"
                                        type="text"
                                        name="imageUrl"
                                        placeholder="https://..."
                                        value={data.imageUrl}
                                        onChange={handleInputChange}
                                    />
                                    <span className="ep-helper">Paste an image URL or upload path</span>
                                </div>

                                {data.imageUrl && data.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                    <div className="ep-image-preview">
                                        <img src={data.imageUrl} alt="Preview" />
                                        <span>Current image</span>
                                    </div>
                                )}
                            </div> */}

                            {/* Actions */}
                            <div className="ep-actions">
                                <button
                                    type="submit"
                                    className="ep-save-btn"
                                    disabled={loading || !hasChanges()}
                                >
                                    {loading ? "Updating…" : "Update Product"}
                                </button>
                                <Link href="/adminDashBoard/viewProducts" className="ep-cancel-btn">
                                    Cancel
                                </Link>
                            </div>

                            {data.createdAt && (
                                <p className="ep-timestamp">
                                    Created: {new Date(data.createdAt).toLocaleString()}
                                </p>
                            )}

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}