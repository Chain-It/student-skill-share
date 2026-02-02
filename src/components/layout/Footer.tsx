import { Link } from "react-router-dom";
import { useState } from "react";

export function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/maqbazog", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg">CampusGigs</span>
          </div>

          {/* Ethics / Mission */}
          <p className="text-sm text-muted-foreground text-center max-w-md">
            A student-powered marketplace for ethical support services —
            helping you learn, earn, and grow responsibly. ✨
          </p>

          {/* Navigation */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/gigs" className="hover:text-foreground transition-colors">
              Browse Gigs
            </Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          {/* Contact Form */}
          <div className="text-center md:text-left">
            <p className="font-medium text-foreground mb-2">Contact Us</p>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto md:mx-0">
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              <textarea
                name="message"
                required
                rows={3}
                placeholder="Your message"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "sent" && (
                <p className="text-green-500 text-sm">Message sent successfully ✅</p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm">Failed to send ❌</p>
              )}
            </form>
          </div>

          {/* Socials */}
          <div className="text-center md:text-right">
            <p className="font-medium text-foreground mb-1">Follow Us</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://x.com/Omar_ER7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://www.instagram.com/umuhammadahmad15/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/umar-muhammad-ahmad-94b46828a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CampusGigs. Built by students, for students 💚
        </div>
      </div>
    </footer>
  );
}
