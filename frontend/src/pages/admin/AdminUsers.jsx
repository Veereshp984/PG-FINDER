import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAdminUsers, updateUserRole } from "../../api/admin.js";

const roleColors = {
  user: "bg-blue-100 text-blue-700",
  owner: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700"
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] })
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All Users</h1>
          <p className="text-slate-500">{users.length} registered users</p>
        </div>
        <Link to="/admin/dashboard" className="text-emerald-600 font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-500">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-lg font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                  {user.role}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Change role:</span>
                  <select
                    className="border rounded-lg px-3 py-1.5 text-sm"
                    value={user.role}
                    onChange={(e) => mutation.mutate({ id: user._id, role: e.target.value })}
                    disabled={mutation.isPending}
                  >
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
