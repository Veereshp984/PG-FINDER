import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"}`;

const mobileNavLinkClass = ({ isActive }) =>
  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-emerald-700" onClick={closeMenu}>
            PG Finder
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/search" className={navLinkClass}>Search</NavLink>
            {user && <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>}
            {user?.role === "owner" && <NavLink to="/owner/dashboard" className={navLinkClass}>Owner</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition ml-2">
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <NavLink to="/profile" className={navLinkClass}>
                  <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </NavLink>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-2 space-y-1">
            <NavLink to="/search" className={mobileNavLinkClass} onClick={closeMenu}>Search</NavLink>
            {user && <NavLink to="/wishlist" className={mobileNavLinkClass} onClick={closeMenu}>Wishlist</NavLink>}
            {user?.role === "owner" && <NavLink to="/owner/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>Owner Dashboard</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>Admin Panel</NavLink>}
            {user ? (
              <>
                <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMenu}>My Profile</NavLink>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMenu}>Login</NavLink>
                <NavLink to="/register" className={mobileNavLinkClass} onClick={closeMenu}>Register</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
