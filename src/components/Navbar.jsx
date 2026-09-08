import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const nav = [
    ["/", "Home"],
    ["/products", "Shop"],
    ["/offers", "Offers"],
    ["/about", "About"],
    ["/contact", "Visit us"],
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">✦</span>
          <span className="brand-text">
            <b>Anish</b> Crackers
          </span>
        </Link>

        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          {nav.map(([path, label]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>

        <Link className="cart-button" to="/cart" aria-label="Shopping cart">
          <ShoppingBag size={19} />
          <span>Cart</span>
          {count > 0 && <em>{count}</em>}
        </Link>
      </div>
    </header>
  );
}
