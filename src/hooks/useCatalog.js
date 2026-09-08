import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { categories as fallbackCategories, products as fallbackProducts } from "../data/products";

export function useCatalog() {
    const [products, setProducts] = useState(fallbackProducts);
    const [categories, setCategories] = useState(fallbackCategories);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [remoteProducts, remoteCategories] = await Promise.all([
                api.getProducts(),
                api.getCategories(),
            ]);

            if (Array.isArray(remoteProducts)) setProducts(remoteProducts);
            if (Array.isArray(remoteCategories)) setCategories(remoteCategories);
            setConnected(true);
            setError(null);
        } catch (err) {
            console.error("[useCatalog] could not reach backend:", err.message);
            setError(err.message);
            setConnected(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { products, categories, loading, error, connected, refetch: load };
}