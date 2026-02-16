import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="text-xl font-semibold text-emerald-700">PG Finder</Link>
            <p className="text-sm text-slate-500">
              Find the perfect paying guest accommodation near you. Browse verified listings with photos, amenities, and real reviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-slate-500 hover:text-emerald-600">Search PGs</Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 hover:text-emerald-600">List Your PG</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-500 hover:text-emerald-600">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@pgfinder.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
          <span>PG Finder © {currentYear}</span>
          <span>Browse trusted PGs with verified owners</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
