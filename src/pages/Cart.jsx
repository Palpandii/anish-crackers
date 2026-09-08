import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, discount, total } = useCart();

  if (!cart.length) {
    return (
      <section className="section page-top">
        <div className="container empty">
          <div className="empty-icon">
            <ShoppingBag size={40} />
          </div>
          <h1>Your cart is empty</h1>
          <p>Add some festive favourites to continue.</p>
          <Link className="btn btn-primary" to="/products">
            Shop crackers
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Your order</p>
          <h1>Shopping cart</h1>
        </div>
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-symbol">✦</div>
                <div className="cart-info">
                  <Link to={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.pack}</p>
                  <strong>₹{item.price.toLocaleString("en-IN")}</strong>
                </div>
                <div className="qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus size={15} />
                  </button>
                  <b>{item.quantity}</b>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus size={15} />
                  </button>
                </div>
                <strong className="line-total">₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                <button className="delete" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <b>₹{subtotal.toLocaleString("en-IN")}</b>
            </div>
            <div>
              <span>Discount</span>
              <b className="saving">-₹{discount.toLocaleString("en-IN")}</b>
            </div>
            <hr />
            <div className="grand">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            <Link className="btn btn-primary full" to="/checkout">
              Proceed to checkout <ArrowRight size={17} />
            </Link>
            <p className="secure">Your details are only used to confirm this order.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
