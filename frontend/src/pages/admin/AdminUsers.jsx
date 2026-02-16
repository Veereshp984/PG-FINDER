import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAdminUsers, updateUserRole } from "../../api/admin.js";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: fetchAdminUsers });
  const mutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] })
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user._id} className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Role:</span>
              <select
                className="border rounded-lg px-2 py-1"
                value={user.role}
                onChange={(event) => mutation.mutate({ id: user._id, role: event.target.value })}
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
