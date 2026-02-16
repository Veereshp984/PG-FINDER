import { useAuth } from "../state/AuthContext.jsx";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="max-w-4xl mx-auto px-4 py-10">Please login to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="bg-white border rounded-xl p-6 space-y-2">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
      </div>
    </div>
  );
};

export default Profile;
