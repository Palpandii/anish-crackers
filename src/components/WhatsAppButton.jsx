import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = "918608624092";
  const message = "Hello Anish Crackers, I would like to know about your Diwali crackers.";
  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={22} />
      <span>Order on WhatsApp</span>
    </a>
  );
}
