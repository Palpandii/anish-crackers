import { Link } from "react-router-dom";

export default function OfferBanner() {
  return (
    <section className="offer-banner">
      <div>
        <p className="eyebrow">Pre-book before Oct 15</p>
        <h2>Early combo pricing, while stock lasts</h2>
        <p>Reserve a Family or Mini celebration box now and lock in this season's opening price.</p>
      </div>
      <Link className="btn btn-light" to="/offers">
        See the offers
      </Link>
    </section>
  );
}
