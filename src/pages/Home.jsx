import { Link } from "react-router-dom";
import { ShieldCheck, BadgeIndianRupee, PackageCheck, Headphones } from "lucide-react";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import OfferBanner from "../components/OfferBanner";
import { useCatalog } from "../hooks/useCatalog";

const benefits = [
  [ShieldCheck, "GST Registered Business", "ANISH CRACKERS is a GST-registered business in Tamil Nadu."],
  [BadgeIndianRupee, "Transparent pricing", "Same rate card online and at our counter, no surprises."],
  [PackageCheck, "Packed to order", "Stock is packed the day you order, not left sitting in storage."],
  [Headphones, "Real support", "Call or WhatsApp us if you're unsure what to pick."],
];

export default function Home() {
  const { products, categories } = useCatalog();
  const bestSellers = products.filter((p) => p.badge === "Bestseller").slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The stall directory</p>
              <h2>Shop by category</h2>
            </div>
            <Link to="/products">View all</Link>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What customers reach for first</p>
              <h2>Best sellers</h2>
            </div>
            <Link to="/products">Shop all</Link>
          </div>
          <div className="product-grid">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <OfferBanner />
      </div>

      <section className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">Why families come back to us</p>
            <h2>Built for a safe, easy celebration</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map(([Icon, title, text]) => (
              <div className="benefit" key={title}>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
