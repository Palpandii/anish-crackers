import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../hooks/useCatalog";

export default function Offers() {
  const { products } = useCatalog();
  const deals = products.filter((p) => (p.oldPrice ?? p.price) - p.price >= 20);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="offer-hero">
          <div>
            <p className="eyebrow">Diwali special, 2026</p>
            <h1>
              More sparkle. <span>Better prices.</span>
            </h1>
            <p>Early combo pricing on selected products before the season rush begins.</p>
            <Link className="btn btn-light" to="/products">
              Shop all products
            </Link>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Limited window</p>
            <h2>Festive favourites on offer</h2>
          </div>
        </div>

        {deals.length > 0 ? (
          <div className="product-grid">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No active offers right now</h2>
            <p>Check back closer to the season for combo pricing.</p>
          </div>
        )}
      </div>
    </section>
  );
}
