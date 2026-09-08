import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.id}`} className="category-card">
      <div className="category-top">
        <span className="category-symbol">{category.symbol}</span>
        <span className="category-tamil">{category.tamil}</span>
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span className="category-link">Explore</span>
    </Link>
  );
}
