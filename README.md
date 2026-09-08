# Deepam Fireworks — frontend

A full multi-page React storefront for a licensed pattasu (fireworks) shop — Diwali-night visual
identity (deep indigo, marigold, sindoor red), not a generic template look.

## Run it

```
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## What's included

- **Pages**: Home, Products (search/filter/sort), Product details, Cart, Checkout, Offers, About, Contact, 404
- **Cart**: persists to `localStorage`, so it survives a page refresh
- **Checkout**: validates the form, then opens WhatsApp with the full order (items, quantities, total,
  delivery/pickup) pre-filled — no backend required to start taking real orders today
- **Data**: `src/data/products.js` — edit this file to add/remove products and categories

## Fixes over a typical first draft

- Discount math falls back safely if a product has no `oldPrice` (no `NaN` on the page)
- Cart survives a refresh (`localStorage`), instead of resetting to empty
- Checkout actually delivers the order (via WhatsApp) instead of just showing a success message that
  goes nowhere
- Form validation shows inline errors instead of relying only on browser tooltips
- Added a 404 page and scroll-to-top on route change

## Connecting a real backend later

If you want order history, stock management, or an admin panel, point this frontend at a backend API —
for example the Spring Boot + MySQL backend built earlier in this project — and replace:
- `src/data/products.js` static arrays with a `fetch('/api/products')` call
- the WhatsApp-only checkout in `src/pages/Checkout.jsx` with a `POST /api/orders` call (you can keep the
  WhatsApp message as a confirmation step alongside it)

## Structure

```
src/
  components/   Navbar, Footer, Hero, ProductCard, CategoryCard, OfferBanner, WhatsAppButton
  context/      CartContext (cart state + localStorage)
  data/         products.js (categories + product catalog)
  pages/        Home, Products, ProductDetails, Cart, Checkout, Offers, About, Contact, NotFound
  index.css     design system (colors, type, layout, responsive rules)
```
