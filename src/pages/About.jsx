import { ShieldCheck, Heart, Sparkles } from "lucide-react";

const points = [
  [ShieldCheck, "GST Registered Business", "ANISH CRACKERS is a GST-registered business in Tamil Nadu."],
  [Heart, "A family stall", "Run by the same family for two generations, from the same street in Sivakasi."],
  [Sparkles, "Packed fresh", "Stock is packed the day you order, not pulled from last season's storage."],
];

export default function About() {
  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Our story</p>
          <h1>A stall built on trust, not just stock.</h1>
          <p>Anish Crackers brings quality-checked crackers, transparent pricing and a simple ordering experience to the festive season.</p>
        </div>
        <div className="about-grid">
          <div className="about-art">
            <span>✦</span>
            <b>Anish</b>
            <span>✦</span>
          </div>
          <div className="about-copy">
            <h2>Why families keep coming back</h2>
            <p>From everyday sparklers to premium celebration boxes, our range is curated so ordering stays simple — for a first-time customer and a regular alike.</p>
            <div className="about-points">
              {points.map(([Icon, title, text]) => (
                <div key={title}>
                  <Icon size={20} />
                  <span>
                    <b>{title}</b>
                    <small>{text}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
