import { useState, useEffect } from "react";
import { CheckCircle2, Pencil, Trash2, X } from "lucide-react";
import { api, adminAuth, getImageUrl } from "../services/api";
import { useCatalog } from "../hooks/useCatalog";

const emptyProduct = {
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    rating: "",
    badge: "",
    pack: "",
    description: "",
    imageUrl: "",
};

const emptyCategory = { id: "", name: "", tamil: "", symbol: "", description: "" };

export default function Admin() {
    const { categories, products, refetch } = useCatalog();
    const [tab, setTab] = useState("product");

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [unlocked, setUnlocked] = useState(adminAuth.isSet());
    const [keyInput, setKeyInput] = useState("");

    const unlock = (e) => {
        e.preventDefault();
        adminAuth.setKey(keyInput);
        setUnlocked(true);
    };

    useEffect(() => {
        if (tab !== "orders") return;
        setOrdersLoading(true);
        api
            .getOrders()
            .then((data) => setOrders(Array.isArray(data) ? data.reverse() : []))
            .catch((err) => console.error("[Admin] could not load orders:", err.message))
            .finally(() => setOrdersLoading(false));
    }, [tab]);

    // --- Product state ---
    const [product, setProduct] = useState(emptyProduct);
    const [editingProductId, setEditingProductId] = useState(null);
    const [productStatus, setProductStatus] = useState(null);
    const [savingProduct, setSavingProduct] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productSearch, setProductSearch] = useState("");

    const updateProduct = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setProductStatus(null);
        try {
            const url = await api.uploadImage(file);
            setProduct((prev) => ({ ...prev, imageUrl: url }));
        } catch (err) {
            setProductStatus({ ok: false, message: err.message });
        } finally {
            setUploadingImage(false);
        }
    };

    const openAddProduct = () => {
        setEditingProductId(null);
        setProduct(emptyProduct);
        setProductStatus(null);
        setShowProductModal(true);
    };

    const startEditProduct = (p) => {
        setEditingProductId(p.id);
        setProduct({
            name: p.name ?? "",
            category: p.category ?? "",
            price: p.price ?? "",
            oldPrice: p.oldPrice ?? "",
            rating: p.rating ?? "",
            badge: p.badge ?? "",
            pack: p.pack ?? "",
            description: p.description ?? "",
            imageUrl: p.imageUrl ?? "",
        });
        setProductStatus(null);
        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setEditingProductId(null);
        setProduct(emptyProduct);
        setProductStatus(null);
    };

    const deleteProduct = async (p) => {
        if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
        try {
            await api.deleteProduct(p.id);
            if (refetch) await refetch();
        } catch (err) {
            setProductStatus({ ok: false, message: err.message });
        }
    };

    const submitProduct = async (e) => {
        e.preventDefault();
        setSavingProduct(true);
        setProductStatus(null);

        const payload = {
            name: product.name,
            category: product.category,
            price: Number(product.price),
            oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
            rating: product.rating ? Number(product.rating) : null,
            badge: product.badge || null,
            pack: product.pack,
            description: product.description,
            imageUrl: product.imageUrl || null,
        };

        try {
            if (editingProductId) {
                await api.updateProduct(editingProductId, payload);
            } else {
                await api.createProduct(payload);
            }
            if (refetch) await refetch();
            closeProductModal();
        } catch (err) {
            setProductStatus({ ok: false, message: err.message });
        } finally {
            setSavingProduct(false);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    // --- Category state ---
    const [category, setCategory] = useState(emptyCategory);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryStatus, setCategoryStatus] = useState(null);
    const [savingCategory, setSavingCategory] = useState(false);

    const updateCategory = (e) => setCategory({ ...category, [e.target.name]: e.target.value });

    const startEditCategory = (c) => {
        setEditingCategoryId(c.id);
        setCategory({
            id: c.id ?? "",
            name: c.name ?? "",
            tamil: c.tamil ?? "",
            symbol: c.symbol ?? "",
            description: c.description ?? "",
        });
        setCategoryStatus(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEditCategory = () => {
        setEditingCategoryId(null);
        setCategory(emptyCategory);
        setCategoryStatus(null);
    };

    const deleteCategory = async (c) => {
        const inUse = products.some((p) => p.category === c.id);
        if (inUse) {
            setCategoryStatus({ ok: false, message: `Can't delete "${c.name}" — products are still using it.` });
            return;
        }
        if (!window.confirm(`Delete category "${c.name}"?`)) return;
        try {
            await api.deleteCategory(c.id);
            if (refetch) await refetch();
        } catch (err) {
            setCategoryStatus({ ok: false, message: err.message });
        }
    };

    const submitCategory = async (e) => {
        e.preventDefault();
        setSavingCategory(true);
        setCategoryStatus(null);
        try {
            if (editingCategoryId) {
                await api.updateCategory(editingCategoryId, category);
                setCategoryStatus({ ok: true, message: `Category "${category.name}" updated.` });
            } else {
                await api.createCategory(category);
                setCategoryStatus({ ok: true, message: `Category "${category.name}" added!` });
            }
            setCategory(emptyCategory);
            setEditingCategoryId(null);
            if (refetch) await refetch();
        } catch (err) {
            setCategoryStatus({ ok: false, message: err.message });
        } finally {
            setSavingCategory(false);
        }
    };

    if (!unlocked) {
        return (
            <section className="section page-top">
                <div className="container" style={{ maxWidth: 400 }}>
                    <div className="page-heading">
                        <p className="eyebrow">Shop admin</p>
                        <h1>Enter admin key</h1>
                    </div>
                    <form className="form-card" onSubmit={unlock}>
                        <div className="form-grid">
                            <label className="wide">
                                Admin key
                                <input
                                    type="password"
                                    value={keyInput}
                                    onChange={(e) => setKeyInput(e.target.value)}
                                    placeholder="Enter your admin secret key"
                                    required
                                    autoFocus
                                />
                            </label>
                        </div>
                        <button className="btn btn-primary full" type="submit">
                            Unlock
                        </button>
                    </form>
                </div>
            </section>
        );
    }

    return (
        <section className="section page-top">
            <div className="container">
                <div className="page-heading">
                    <p className="eyebrow">Shop admin</p>
                    <h1>Manage products &amp; categories</h1>
                    <p>Changes save straight to the database — no code changes needed.</p>
                </div>

                <div className="filter-row" style={{ marginBottom: 24 }}>
                    <button className={tab === "product" ? "filter active" : "filter"} onClick={() => setTab("product")}>
                        Products ({products.length})
                    </button>
                    <button className={tab === "category" ? "filter active" : "filter"} onClick={() => setTab("category")}>
                        Categories ({categories.length})
                    </button>
                    <button className={tab === "orders" ? "filter active" : "filter"} onClick={() => setTab("orders")}>
                        Orders ({orders.length})
                    </button>
                </div>

                {tab === "product" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Search products by name..."
                                style={{ flex: 1, minWidth: 200 }}
                            />
                            <button className="btn btn-primary" onClick={openAddProduct} type="button">
                                + Add product
                            </button>
                        </div>

                        <div className="admin-list">
                            {filteredProducts.map((p) => (
                                <div key={p.id} className="admin-row">
                                    <div>
                                        <strong>{p.name}</strong>
                                        <p className="small-note">
                                            {p.category} · ₹{p.price} {p.oldPrice ? `(was ₹${p.oldPrice})` : ""} · {p.pack}
                                        </p>
                                    </div>
                                    <div className="admin-row-actions">
                                        <button className="btn btn-light" onClick={() => startEditProduct(p)} aria-label="Edit">
                                            <Pencil size={15} />
                                        </button>
                                        <button className="btn btn-light" onClick={() => deleteProduct(p)} aria-label="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && <p className="small-note">No products found.</p>}
                        </div>
                    </>
                )}

                {showProductModal && (
                    <div className="modal-overlay" onClick={closeProductModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeProductModal} aria-label="Close" type="button">
                                <X size={20} />
                            </button>
                            <form onSubmit={submitProduct} noValidate>
                                <h2>{editingProductId ? "Edit product" : "Add a new product"}</h2>
                                <div className="form-grid">
                                    <label>
                                        Product name
                                        <input name="name" value={product.name} onChange={updateProduct} placeholder="e.g. Rocket Shower" required />
                                    </label>
                                    <label>
                                        Category
                                        <select name="category" value={product.category} onChange={updateProduct} required>
                                            <option value="" disabled>
                                                Select a category
                                            </option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.symbol} {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Price (₹)
                                        <input name="price" type="number" min="1" value={product.price} onChange={updateProduct} placeholder="199" required />
                                    </label>
                                    <label>
                                        Old price (₹) — optional
                                        <input name="oldPrice" type="number" min="1" value={product.oldPrice} onChange={updateProduct} placeholder="249" />
                                    </label>
                                    <label>
                                        Rating — optional
                                        <input name="rating" type="number" step="0.1" min="1" max="5" value={product.rating} onChange={updateProduct} placeholder="4.5" />
                                    </label>
                                    <label>
                                        Badge — optional
                                        <select name="badge" value={product.badge} onChange={updateProduct}>
                                            <option value="">No badge</option>
                                            <option value="New">New</option>
                                            <option value="Bestseller">Bestseller</option>
                                        </select>
                                    </label>
                                    <label>
                                        Pack
                                        <input name="pack" value={product.pack} onChange={updateProduct} placeholder="1 piece / box of 10" required />
                                    </label>
                                    <label className="wide">
                                        Description
                                        <textarea name="description" value={product.description} onChange={updateProduct} placeholder="Short description shown on the product page" />
                                    </label>
                                    <label className="wide">
                                        Product photo
                                        <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploadingImage} />
                                        {uploadingImage && <span className="small-note">Uploading...</span>}
                                        {product.imageUrl && !uploadingImage && (
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt="Preview"
                                                style={{ marginTop: 8, height: 120, borderRadius: 8, objectFit: "cover" }}
                                            />
                                        )}
                                    </label>
                                </div>

                                {productStatus && (
                                    <p className="small-note" style={{ color: productStatus.ok ? "#1a7a3d" : "#b3261e" }}>
                                        {productStatus.ok && <CheckCircle2 size={15} style={{ verticalAlign: "middle", marginRight: 4 }} />}
                                        {productStatus.message}
                                    </p>
                                )}

                                <button className="btn btn-primary full" type="submit" disabled={savingProduct}>
                                    {savingProduct ? "Saving..." : editingProductId ? "Update product" : "Add product"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {tab === "category" && (
                    <>
                        <form className="form-card" onSubmit={submitCategory} noValidate>
                            <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {editingCategoryId ? "Edit category" : "Category details"}
                                {editingCategoryId && (
                                    <button type="button" className="btn btn-light" onClick={cancelEditCategory}>
                                        <X size={14} /> Cancel
                                    </button>
                                )}
                            </h2>
                            <div className="form-grid">
                                <label>
                                    Category id (short, no spaces — e.g. "rockets")
                                    <input
                                        name="id"
                                        value={category.id}
                                        onChange={updateCategory}
                                        placeholder="rockets"
                                        required
                                        disabled={!!editingCategoryId}
                                    />
                                </label>
                                <label>
                                    Name
                                    <input name="name" value={category.name} onChange={updateCategory} placeholder="Rockets" required />
                                </label>
                                <label>
                                    Tamil name
                                    <input name="tamil" value={category.tamil} onChange={updateCategory} placeholder="ராக்கெட்" required />
                                </label>
                                <label>
                                    Symbol (one character/emoji)
                                    <input name="symbol" value={category.symbol} onChange={updateCategory} placeholder="☄" required />
                                </label>
                                <label className="wide">
                                    Description
                                    <textarea name="description" value={category.description} onChange={updateCategory} placeholder="Short line shown under the category name" />
                                </label>
                            </div>

                            {categoryStatus && (
                                <p className="small-note" style={{ color: categoryStatus.ok ? "#1a7a3d" : "#b3261e" }}>
                                    {categoryStatus.ok && <CheckCircle2 size={15} style={{ verticalAlign: "middle", marginRight: 4 }} />}
                                    {categoryStatus.message}
                                </p>
                            )}

                            <button className="btn btn-primary full" type="submit" disabled={savingCategory}>
                                {savingCategory ? "Saving..." : editingCategoryId ? "Update category" : "Add category"}
                            </button>
                        </form>

                        <h3 style={{ marginTop: 32, marginBottom: 12 }}>All categories</h3>
                        <div className="admin-list">
                            {categories.map((c) => (
                                <div key={c.id} className="admin-row">
                                    <div>
                                        <strong>{c.symbol} {c.name}</strong>
                                        <p className="small-note">{c.tamil} · id: {c.id}</p>
                                    </div>
                                    <div className="admin-row-actions">
                                        <button className="btn btn-light" onClick={() => startEditCategory(c)} aria-label="Edit">
                                            <Pencil size={15} />
                                        </button>
                                        <button className="btn btn-light" onClick={() => deleteCategory(c)} aria-label="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && <p className="small-note">No categories yet.</p>}
                        </div>
                    </>
                )}

                {tab === "orders" && (
                    <div className="admin-list">
                        {ordersLoading && <p className="small-note">Loading orders...</p>}
                        {!ordersLoading && orders.length === 0 && <p className="small-note">No orders yet.</p>}
                        {orders.map((o) => (
                            <div key={o.id} className="admin-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                <strong>
                                    Order #{o.id} — {o.customerName} ({o.phone})
                                </strong>
                                <p className="small-note">
                                    {o.fulfilmentMode} · ₹{o.total} · {new Date(o.createdAt).toLocaleString("en-IN")}
                                </p>
                                {o.fulfilmentMode === "Delivery" && (
                                    <p className="small-note">
                                        {o.addressLine1}, {o.addressCity} - {o.addressPincode}
                                    </p>
                                )}
                                <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                                    {o.items?.map((it) => (
                                        <li key={it.id} className="small-note">
                                            {it.name} × {it.quantity} — ₹{it.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <p className="small-note" style={{ marginTop: 24 }}>
                    Currently {products.length} products across {categories.length} categories.
                </p>
            </div>
        </section>
    );
}