import { Link } from 'react-router-dom';

export function Footer() {
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
            {/* Optional future links */}
            {/* <Link to="/about">About</Link> */}
            {/* <Link to="/faq">FAQ</Link> */}
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          {/* Contact */}
          <div className="text-center md:text-left">
            <p className="font-medium text-foreground mb-1">Contact</p>
            <p>
              Email:{" "}
              <span className="hover:text-foreground transition-colors cursor-pointer">
                your-email@campusgigs.com
              </span>
            </p>
            {/* Optional */}
            {/* <p>Support Hours: Mon–Fri, 9am–5pm</p> */}
          </div>

          {/* Socials */}
          <div className="text-center md:text-right">
            <p className="font-medium text-foreground mb-1">Follow Us</p>
            <div className="flex justify-center md:justify-end gap-4">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Twitter
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Instagram
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                LinkedIn
              </span>
              {/* Replace spans with <a> when ready */}
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
