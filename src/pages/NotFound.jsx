import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="container empty">
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist, or has moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
