import { Link, useParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { product } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <section className="section page-top">
        <div className="container empty">
          <h2>Product not found</h2>
          <Link to="/products">Back to products</Link>
        </div>
      </section>
    );
  }

  const original = product.oldPrice ?? product.price;
  const discount = original > product.price ? Math.round(((original - product.price) / original) * 100) : 0;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="section page-top">
      <div className="container">
        <Link className="back-link" to="/products">
          <ArrowLeft size={16} /> Back to products
        </Link>
        <div className="details">
          <div className="details-visual">
            <span>✦</span>
          </div>
          <div className="details-info">
            <p className="eyebrow">{product.category.replace("-", " ")}</p>
            <h1>{product.name}</h1>
            <div className="rating">
              <Star size={16} fill="currentColor" /> {product.rating} rating
            </div>
            <p className="details-copy">{product.description}</p>
            <div className="price-row">
              <strong>₹{product.price.toLocaleString("en-IN")}</strong>
              {discount > 0 && (
                <>
                  <del>₹{original.toLocaleString("en-IN")}</del>
                  <span>{discount}% off</span>
                </>
              )}
            </div>
            <div className="meta">
              <span>
                Pack: <b>{product.pack}</b>
              </span>
              <span>
                Availability: <b>In stock</b>
              </span>
            </div>
            <div className="buy-row">
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <b>{qty}</b>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd}>
                <ShoppingCart size={18} /> {added ? "Added to cart" : "Add to cart"}
              </button>
            </div>
            <div className="note">Sold only to customers aged 18 and above · Burst in open outdoor space only</div>
          </div>
        </div>
      </div>
    </section>
  );
}
