import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import PGDetail from "./pages/PGDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Profile from "./pages/Profile.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import OwnerCreatePG from "./pages/owner/OwnerCreatePG.jsx";
import OwnerEditPG from "./pages/owner/OwnerEditPG.jsx";
import OwnerInquiries from "./pages/owner/OwnerInquiries.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPGs from "./pages/admin/AdminPGs.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pg/:id" element={<PGDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/create-pg" element={<OwnerCreatePG />} />
          <Route path="/owner/edit-pg/:id" element={<OwnerEditPG />} />
          <Route path="/owner/inquiries" element={<OwnerInquiries />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pgs" element={<AdminPGs />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
