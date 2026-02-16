import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Manage PG Listings",
      description: "View, edit, or remove PG listings",
      to: "/admin/pgs",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Manage Users",
      description: "View users and manage roles",
      to: "/admin/users",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage platform settings and content</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.to}
            to={card.to} 
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{card.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
