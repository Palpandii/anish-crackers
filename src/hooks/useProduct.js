import { useEffect, useState } from "react";
import { api } from "../services/api";
import { getProduct as getFallbackProduct } from "../data/products";

export function useProduct(id) {
    const [product, setProduct] = useState(() => getFallbackProduct(id));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        api
            .getProduct(id)
            .then((remote) => {
                if (cancelled) return;
                if (remote) setProduct(remote);
                setError(null);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error("[useProduct] could not reach backend:", err.message);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { product, loading, error };
}