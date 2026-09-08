const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

const ADMIN_KEY_STORAGE = "deepam_admin_key";

export const adminAuth = {
    getKey: () => sessionStorage.getItem(ADMIN_KEY_STORAGE),
    setKey: (key) => sessionStorage.setItem(ADMIN_KEY_STORAGE, key),
    clearKey: () => sessionStorage.removeItem(ADMIN_KEY_STORAGE),
    isSet: () => !!sessionStorage.getItem(ADMIN_KEY_STORAGE),
};

export function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_ORIGIN}${path}`;
}

async function request(path, options = {}, requiresAdmin = false) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

    if (requiresAdmin) {
        const key = adminAuth.getKey();
        if (key) headers["X-Admin-Key"] = key;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (res.status === 401) {
        throw new Error("Incorrect admin key. Please re-enter it.");
    }

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`API ${options.method || "GET"} ${path} failed: ${res.status} ${body}`.trim());
    }

    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("application/json") ? res.json() : null;
}

async function uploadImage(file) {
    const key = adminAuth.getKey();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/uploads`, {
        method: "POST",
        headers: key ? { "X-Admin-Key": key } : {},
        body: formData,
    });

    if (res.status === 401) {
        throw new Error("Incorrect admin key. Please re-enter it.");
    }
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Image upload failed: ${res.status} ${body}`.trim());
    }

    const data = await res.json();
    return data.url;
}

export const api = {
    getProducts: () => request("/products"),
    getProduct: (id) => request(`/products/${id}`),
    createProduct: (product) => request("/products", { method: "POST", body: JSON.stringify(product) }, true),
    updateProduct: (id, product) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) }, true),
    deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }, true),

    getCategories: () => request("/categories"),
    createCategory: (category) => request("/categories", { method: "POST", body: JSON.stringify(category) }, true),
    updateCategory: (id, category) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(category) }, true),
    deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }, true),

    placeOrder: (order) => request("/orders", { method: "POST", body: JSON.stringify(order) }),
    getOrders: () => request("/orders", {}, true),

    uploadImage,
};