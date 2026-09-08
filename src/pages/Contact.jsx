import { MapPin, Phone, Mail, Clock } from "lucide-react";

const cards = [
  [MapPin, "Visit us", "Anish Crackers", "Sivakasi to Sattur, Chinnakamanpatti", "Tamil Nadu, India"],
  [Phone, "Call / WhatsApp", "+91 86086 55997", "Mon–Sat, 8 AM–10 PM"],
  [Mail, "Email", "anishcrackerssrt@gmail.com", "We reply within a day"],
  [Clock, "Store hours", "Daily during season", "8:00 AM – 10:30 PM"],
];

export default function Contact() {
  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Get in touch</p>
          <h1>We're happy to help you choose.</h1>
          <p>Have a question about a product, or want help planning a combo box? Reach out.</p>
        </div>
        <div className="contact-grid">
          {cards.map(([Icon, title, ...lines]) => (
            <div className="contact-card" key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>
                {lines.map((l, i) => (
                  <span key={i}>
                    {l}
                    {i < lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="map-placeholder">
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.15064657196!2d77.86196047478558!3d9.408176890669086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cb00319d5849%3A0xd73cbc10c522e793!2sAnish%20crackers!5e0!3m2!1sen!2sin!4v1788697897784!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Anish Crackers Location"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
