import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-rangoli" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ fontSize: i % 2 === 0 ? "8px" : "14px", opacity: i % 2 === 0 ? 0.5 : 0.9 }}>
            ◆
          </span>
        ))}
      </div>
      <div className="container hero-content">
        <p className="eyebrow">This Diwali, from our family stall to your courtyard</p>
        <h1>
          Light up the sky, <span>keep the ground safe</span>
        </h1>
        <p className="hero-copy">
          Licensed sparklers, flower pots and sky shells, tested every season and packed the day you order.
          Walk in to our Kumbakonam stall, or reserve online and collect at the counter.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/products">
            Browse the stall
          </Link>
          <Link className="btn btn-ghost" to="/offers">
            See combo offers
          </Link>
        </div>
        <div className="hero-trust">
          <span>Licensed dealer</span>
          <span>Quality checked every season</span>
          <span>Pickup or delivery</span>
        </div>
      </div>
    </section>
  );
}
