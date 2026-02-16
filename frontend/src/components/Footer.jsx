import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="text-xl font-bold text-white">PG Finder</Link>
          <p className="text-sm">Find your perfect paying guest accommodation with verified listings and genuine reviews.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-white transition">Search PGs</Link></li>
            <li><Link to="/register" className="hover:text-white transition">List Your PG</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
          </ul>
        </div>

        {/* For Owners */}
        <div>
          <h4 className="text-white font-medium mb-4">For PG Owners</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
            <li><Link to="/owner/dashboard" className="hover:text-white transition">Owner Dashboard</Link></li>
            <li><Link to="/owner/create-pg" className="hover:text-white transition">Add Listing</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: support@pgfinder.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Hours: 9AM - 6PM IST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 text-sm flex flex-col md:flex-row justify-between gap-2">
        <span>© 2024 PG Finder. All rights reserved.</span>
        <span>Made with care for students & professionals.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
