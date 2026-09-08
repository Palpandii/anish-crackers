import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

const SHOP_PHONE = "918608624092";

function buildWhatsAppMessage(form, cart, total) {
  const lines = [
    `New order request - Anish Crackers`,
    ``,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Fulfilment: ${form.mode}`,
  ];
  if (form.mode === "Delivery") {
    lines.push(`Address: ${form.address}, ${form.city} - ${form.pincode}`);
  }
  lines.push(``, `Items:`);
  cart.forEach((item) => {
    lines.push(`- ${item.name} x${item.quantity} = Rs.${item.price * item.quantity}`);
  });
  lines.push(``, `Total: Rs.${total}`);
  return lines.join("\n");
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "", mode: "Pickup" });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  if (!cart.length && !submitted) {
    return (
      <section className="section page-top">
        <div className="container empty">
          <h2>Your cart is empty</h2>
          <Link to="/products">Continue shopping</Link>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="section page-top">
        <div className="container success">
          <CheckCircle2 size={64} />
          <h1>Order request sent</h1>
          <p>
            Thank you, {form.name}. We've opened WhatsApp with your order details — send that message and our team will confirm on {form.phone}.
          </p>
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!/^[0-9]{10}$/.test(form.phone)) next.phone = "Enter a 10-digit mobile number";
    if (form.mode === "Delivery") {
      if (!form.address.trim()) next.address = "Enter your delivery address";
      if (!form.city.trim()) next.city = "Enter your city";
      if (!/^[0-9]{6}$/.test(form.pincode)) next.pincode = "Enter a 6-digit pincode";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.placeOrder({
        customerName: form.name,
        phone: form.phone,
        fulfilmentMode: form.mode,
        address:
          form.mode === "Delivery"
            ? { line1: form.address, city: form.city, pincode: form.pincode }
            : null,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
      });
    } catch (err) {
      console.error("[Checkout] order save failed:", err.message);
    }

    const message = buildWhatsAppMessage(form, cart, total);
    window.open(`https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitted(true);
    clearCart();
  };

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order</h1>
        </div>
        <form className="checkout-layout" onSubmit={submit} noValidate>
          <div className="form-card">
            <h2>Customer details</h2>
            <div className="form-grid">
              <label>
                Full name
                <input name="name" value={form.name} onChange={update} placeholder="Your name" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>
              <label>
                Mobile number
                <input name="phone" value={form.phone} onChange={update} placeholder="10-digit mobile" inputMode="numeric" />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>

              {form.mode === "Delivery" && (
                <>
                  <label className="wide">
                    Address
                    <textarea name="address" value={form.address} onChange={update} placeholder="Delivery address" />
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </label>
                  <label>
                    City
                    <input name="city" value={form.city} onChange={update} placeholder="City" />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </label>
                  <label>
                    Pincode
                    <input name="pincode" value={form.pincode} onChange={update} placeholder="6-digit pincode" inputMode="numeric" />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </label>
                </>
              )}
            </div>

            <h2>Fulfilment</h2>
            <div className="mode-options">
              <label>
                <input type="radio" name="mode" value="Pickup" checked={form.mode === "Pickup"} onChange={update} /> Store pickup
              </label>
              <label>
                <input type="radio" name="mode" value="Delivery" checked={form.mode === "Delivery"} onChange={update} /> Home delivery
              </label>
            </div>
            <p className="small-note">Submitting opens WhatsApp with your order pre-filled — send it and our team will confirm payment and timing.</p>
            <button className="btn btn-primary full" type="submit">
              Send order on WhatsApp · ₹{total.toLocaleString("en-IN")}
            </button>
          </div>
          <aside className="summary">
            <h2>Your items</h2>
            {cart.map((i) => (
              <div className="mini-item" key={i.id}>
                <span>
                  {i.name} × {i.quantity}
                </span>
                <b>₹{(i.price * i.quantity).toLocaleString("en-IN")}</b>
              </div>
            ))}
            <hr />
            <div className="grand">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
