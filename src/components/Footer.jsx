import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">✦</span>
            <span>
              <b>ANISH</b> CRACKERS
            </span>
          </Link>
          <p>Licensed sparklers, flower pots and combo boxes for joyful family celebrations.</p>
          <div className="socials">
            <a href="https://www.instagram.com/anishcrackers?stkn=MTdxeTgxODN3ZnY4NA==" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4>Quick links</h4>
          <Link to="/products">Shop</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Visit us</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <MapPin size={48} /> 3/265/A5, Sivakasi to Sattur Main     Road, Sattur Taluk, Chinnakamanpatti, Virudhunagar, Tamil Nadu, 626189.
          </p>
          <p>
            <Phone size={16} /> +91 86086 55997, +91 86080 37087
          </p>
          <p>
            <Mail size={16} /> anishcrackerssrt@gmail.com
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          Explosives license TN-EX-0421 · Sold only to customers aged 18 and above · © {new Date().getFullYear()} Anish Crackers
        </div>
      </div>
    </footer>
  );
}
