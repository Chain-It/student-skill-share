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
            <p className="font-medium text-foreground mb-2">Follow Us</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://x.com/Omar_ER7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/umuhammadahmad15/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/umar-muhammad-ahmad-94b46828a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
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
