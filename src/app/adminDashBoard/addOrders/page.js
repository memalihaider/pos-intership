"use client"
import { useEffect, useState } from "react"
import { db } from "../../../config/firebase";
import { getDocs, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import BarcodeScanner from "@/components/barcodeScanner";
import { useLogout } from "@/components/useLogout";
import "./addOrders.css";

const navItems = [
    { label: "Dashboard",        href: "/adminDashBoard" },
    { label: "Sales & Checkout", href: "/adminDashBoard/addOrders" },
    { label: "Products",         href: "/adminDashBoard/viewProducts" },
    { label: "Orders",           href: "/adminDashBoard/viewOrders" },
    { label: "Users & Roles",    href: "/adminDashBoard/viewStaff" },
];

export default function AddOrders() {
    const pathname = usePathname();
    const logout = useLogout();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [data, setData] = useState({ customer: "", paymentType: "cash" });
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    // ── Barcode scanner state ──
    const [showScanner, setShowScanner] = useState(false);

    async function fetchProducts() {
        try {
            const res = await getDocs(collection(db, "product"));
            const list = [];
            res.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setProducts(list);
        } catch (e) {
            console.error("Error fetching products:", e);
        }
    }

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    function handleChange(e) {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    function addToCart(product) {
        if (product.stock < 1) return;
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert(`Only ${product.stock} in stock`);
                    return prev;
                }
                return prev.map(i => i.id === product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                stock: product.stock,
                quantity: 1,
            }];
        });
    }

    // ── Barcode scan handler ──
    function handleScan(barcodeValue) {
        setShowScanner(false);

        // Match by barcode field first, then by name
        const found = products.find(p =>
            p.barcode === barcodeValue ||
            p.name?.toLowerCase() === barcodeValue.toLowerCase()
        );

        if (found) {
            addToCart(found);
        } else {
            alert(`No product found for barcode: ${barcodeValue}`);
        }
    }

    function removeFromCart(id) {
        setCartItems(prev => prev.filter(i => i.id !== id));
    }

    function changeQty(id, delta) {
        setCartItems(prev => prev.map(i => {
            if (i.id !== id) return i;
            const newQty = i.quantity + delta;
            if (newQty < 1) return i;
            if (newQty > i.stock) { alert(`Only ${i.stock} in stock`); return i; }
            return { ...i, quantity: newQty };
        }));
    }

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const totalDiscount = cartItems.reduce((s, i) => s + (i.discount || 0) * i.quantity, 0);
    const grandTotal = subtotal - totalDiscount;

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.includes(search)
    );

    async function handleCheckout(e) {
        e.preventDefault();
        if (!data.customer.trim()) { alert("Please enter customer name"); return; }
        if (cartItems.length === 0) { alert("Cart is empty"); return; }

        setLoading(true);
        try {
            await Promise.all(cartItems.map(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    return updateDoc(doc(db, "product", item.id), {
                        stock: product.stock - item.quantity
                    });
                }
            }));

            const orderData = {
                customer: data.customer,
                paymentType: data.paymentType,
                amount: grandTotal,
                discount: totalDiscount,
                subtotal,
                items: cartItems.map(i => ({
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price,
                    discount: i.discount,
                    total: (i.price * i.quantity) - (i.discount * i.quantity)
                })),
                paymentStatus: data.paymentType === "card" ? "pending" : "completed",
                createdAt: new Date()
            };

            const docRef = await addDoc(collection(db, "orders"), orderData);
            setCurrentOrder({ id: docRef.id, ...orderData });
            setOrderSuccess(true);
            setShowReceipt(true);
            setCartItems([]);
            setData({ customer: "", paymentType: "cash" });
            fetchProducts();
        } catch (e) {
            console.error("Error:", e);
            alert("Failed to place order.");
        } finally {
            setLoading(false);
        }
    }

    function handlePrint() { window.print(); }
    function closeReceipt() { setShowReceipt(false); setCurrentOrder(null); }

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
                    <button className="logout-btn" onClick={logout}>🚪 Logout</button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main-content">

                <header className="topbar">
                    <div className="topbar-left">
                        <button className="hamburger-btn" onClick={() => setSidebarOpen(p => !p)}>☰</button>
                        <span className="page-title">Sales &amp; Checkout</span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">👤 Admin Access</div>
                    </div>
                </header>

                <div className="checkout-body">

                    {/* Products Panel */}
                    <div className="products-panel">
                        <div className="products-panel-header">
                            <h2 className="panel-heading">Products</h2>

                            {/* Search + Scan button */}
                            <div className="search-scan-row">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search products or barcode..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button
                                    className="scan-btn"
                                    onClick={() => setShowScanner(true)}
                                    title="Scan barcode"
                                >
                                    📷 Scan
                                </button>
                            </div>
                        </div>

                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-card-top">
                                        <div>
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-sku">
                                                {product.barcode || product.sku || product.id?.slice(0, 6).toUpperCase()}
                                            </div>
                                        </div>
                                        <span className={`stock-badge ${product.stock < 10 ? "low" : ""}`}>
                                            {product.stock} in stock
                                        </span>
                                    </div>
                                    <div className="product-card-bottom">
                                        <span className="product-price">{Number(product.price).toFixed(2)}</span>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock < 1}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="no-products">No products found</div>
                            )}
                        </div>
                    </div>

                    {/* Cart Panel */}
                    <div className="cart-panel">
                        <h2 className="cart-heading">
                            🛒 Cart ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                        </h2>

                        <div className="cart-section">
                            <label className="cart-label">Customer (Optional)</label>
                            <input
                                type="text"
                                name="customer"
                                className="cart-input"
                                placeholder="Enter customer name"
                                value={data.customer}
                                onChange={handleChange}
                            />
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="cart-empty">
                                <div className="cart-empty-icon">🛒</div>
                                <p>Cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items-list">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="cart-item-row">
                                            <div className="cart-item-info">
                                                <span className="cart-item-name">{item.name}</span>
                                                <span className="cart-item-price">{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="cart-item-controls">
                                                <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                                                <span className="qty-val">{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-section">
                                    <label className="cart-label">Payment Method</label>
                                    <select
                                        name="paymentType"
                                        className="cart-input"
                                        value={data.paymentType}
                                        onChange={handleChange}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                    </select>
                                </div>

                                <div className="cart-totals">
                                    <div className="totals-row">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="totals-row discount">
                                            <span>Discount</span>
                                            <span>−{totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="totals-row grand">
                                        <span>Total</span>
                                        <span>{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading ? "Processing…" : "Complete Order"}
                                </button>
                            </>
                        )}

                        {orderSuccess && cartItems.length === 0 && (
                            <button className="print-receipt-btn" onClick={() => setShowReceipt(true)}>
                                🖨️ Print Last Receipt
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Barcode Scanner Modal */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Receipt Modal */}
            {showReceipt && currentOrder && (
                <div className="receipt-backdrop" onClick={closeReceipt}>
                    <div className="receipt-modal" onClick={e => e.stopPropagation()}>
                        <div className="receipt-header">
                            <h2>ORDER RECEIPT</h2>
                            <p>Order #{currentOrder.id.slice(0, 8)}</p>
                            <p>{new Date().toLocaleString()}</p>
                        </div>

                        <div className="receipt-items">
                            {currentOrder.items.map((item, i) => (
                                <div key={i} className="receipt-item">
                                    <div>
                                        <div className="receipt-item-name">{item.name}</div>
                                        <div className="receipt-item-meta">
                                            Qty: {item.quantity} @ {item.price}
                                            {item.discount > 0 && ` − ${(item.discount * item.quantity).toFixed(2)}`}
                                        </div>
                                    </div>
                                    <div className="receipt-item-total">
                                        {((item.price * item.quantity) - (item.discount * item.quantity)).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="receipt-totals">
                            <div className="receipt-row"><span>Subtotal</span><span>{currentOrder.subtotal?.toFixed(2)}</span></div>
                            <div className="receipt-row"><span>Discount</span><span>−{currentOrder.discount?.toFixed(2)}</span></div>
                            <div className="receipt-row grand"><span>Total</span><span>{currentOrder.amount?.toFixed(2)}</span></div>
                        </div>

                        <div className="receipt-footer">
                            <p>Customer: {currentOrder.customer || "Walk-in"}</p>
                            <p>Payment: {currentOrder.paymentType}</p>
                            <p>Status: {currentOrder.paymentStatus}</p>
                            <p className="thanks">Thank you for your business!</p>
                        </div>

                        <div className="receipt-actions">
                            <button className="receipt-print-btn" onClick={handlePrint}>Print</button>
                            <button className="receipt-close-btn" onClick={closeReceipt}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}