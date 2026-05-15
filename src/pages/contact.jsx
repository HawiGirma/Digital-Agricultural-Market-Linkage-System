import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import "../styles/contact.css";
export default function ContactSection() {
  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      text: "+251 11 555 0123",
    },
    {
      icon: Mail,
      title: "Email",
      text: "hello@agrilink.et",
    },
    {
      icon: MapPin,
      title: "Address",
      text: "Bole, Addis Ababa — pilot coordination office (MVP)",
    },
    {
      icon: Clock,
      title: "Business Hours",
      text: "Mon-Sat: 7am-9pm, Sun: 9am-6pm",
    },
  ];
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="bg-gradient-to-br from-green-50 to-slate-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fadeUp">
          <h2 className="text-3xl font-bold text-slate-950">Get in Touch</h2>
          <p className="mt-3 text-slate-700 max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            {contactCards.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="animate-slideInLeft flex items-center gap-4 rounded-xl bg-white p-5 shadow-md border border-slate-100"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm text-green-600">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-slideInRight rounded-xl bg-white p-6 shadow-md border border-slate-100">
            <h3 className="text-xl font-bold text-slate-950 mb-5">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {sent && (
                <div className="animate-fadeUp flex items-center gap-3 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-sm text-green-800">
                  <CheckCircle size={18} />
                  <span>
                    Thank you! Your message has been sent successfully. We'll
                    get back to you soon.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-slate-950">
                  Name *
                  <input
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-950">
                  Email *
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-950">
                Subject *
                <select
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  <option value="Order Support">Order Support</option>
                  <option value="Delivery Question">Delivery Question</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-950">
                Message *
                <textarea
                  rows="6"
                  placeholder="How can we help you?"
                  className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition"
              >
                <Send size={17} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-100 animate-fadeUp">
          <h3 className="text-xl font-bold text-slate-950 mb-5">
            Frequently Asked Questions
          </h3>

          <div className="space-y-5 text-sm">
            <div>
              <h4 className="font-bold text-slate-950">
                What are your delivery hours?
              </h4>
              <p className="mt-2 text-slate-700">
                We deliver 7 days a week between 8am-8pm. You can select your
                preferred delivery window during checkout.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950">
                Do you offer same-day delivery?
              </h4>
              <p className="mt-2 text-slate-700">
                Yes! Orders placed before 12pm can be delivered the same day,
                subject to availability in your area.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-950">
                What is your return policy?
              </h4>
              <p className="mt-2 text-slate-700">
                We guarantee 100% freshness. If you're not satisfied with any
                product, contact us within 24 hours for a full refund or
                replacement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
