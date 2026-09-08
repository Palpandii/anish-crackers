import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../hooks/useCatalog";

export default function Products() {
  const { products, categories } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const category = params.get("category") || "all";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const filtered = useMemo(() => {
    const list = products
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [category, query, sort]);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Our collection</p>
          <h1>Crackers and combos</h1>
          <p>Choose your favourites and build your own Diwali box.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="search">
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search crackers..." aria-label="Search products" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="filter-row">
          <button className={category === "all" ? "filter active" : "filter"} onClick={() => setParams({})}>
            <SlidersHorizontal size={15} /> All
          </button>
          {categories.map((c) => (
            <button key={c.id} className={category === c.id ? "filter active" : "filter"} onClick={() => setParams({ category: c.id })}>
              {c.symbol} {c.name}
            </button>
          ))}
        </div>

        <p className="result-count">{filtered.length} products</p>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No products found</h2>
            <p>Try a different search term or category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
