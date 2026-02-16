import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700 hover:text-emerald-700"}`;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-emerald-700">PG Finder</Link>
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/search" className={navLinkClass}>Search</NavLink>
          {user && <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>}
          {user?.role === "owner" && <NavLink to="/owner/dashboard" className={navLinkClass}>Owner</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/register" className={navLinkClass}>Register</NavLink>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-emerald-700">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
