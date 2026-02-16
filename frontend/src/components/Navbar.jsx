import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700 hover:text-emerald-700"}`;

const mobileNavLinkClass = ({ isActive }) =>
  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-emerald-700">PG Finder</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/search" className={navLinkClass}>Search</NavLink>
            {user && <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>}
            {user?.role === "owner" && <NavLink to="/owner/dashboard" className={navLinkClass}>Owner</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-emerald-700">Logout</button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t pt-3 space-y-1">
            <NavLink to="/search" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Search</NavLink>
            {user && <NavLink to="/wishlist" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Wishlist</NavLink>}
            {user?.role === "owner" && <NavLink to="/owner/dashboard" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Owner Dashboard</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Profile</NavLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
