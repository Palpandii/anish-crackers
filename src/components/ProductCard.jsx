import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const original = product.oldPrice ?? product.price;
  const discount = original > product.price ? Math.round(((original - product.price) / original) * 100) : 0;

  return (
    <article className="product-card">
      <div className="product-visual">
        {product.badge && <span className="badge">{product.badge}</span>}
        {discount > 0 && <span className="discount">-{discount}%</span>}
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-photo" />
        ) : (
          <span className="product-symbol">{"✦"}</span>
        )}
      </div>
      <div className="product-body">
        <div className="rating">
          <Star size={14} fill="currentColor" /> {product.rating}
        </div>
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="pack">{product.pack}</p>
        <div className="product-bottom">
          <div>
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            {discount > 0 && <del>₹{original.toLocaleString("en-IN")}</del>}
          </div>
          <button className="icon-btn" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
