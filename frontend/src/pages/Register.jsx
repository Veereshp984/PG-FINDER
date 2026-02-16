import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import { useAuth } from "../state/AuthContext.jsx";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "owner"]).default("user"),
  phone: z.string().optional()
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" }
  });

  const selectedRole = watch("role");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/");
    }
  });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-slate-500 mt-1">Join PG Finder today</p>
      </div>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4 bg-white border rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            {...register("name")}
            placeholder="Your full name"
            className="border rounded-lg px-3 py-2 w-full"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="border rounded-lg px-3 py-2 w-full"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone (optional)</label>
          <input
            {...register("phone")}
            placeholder="Your phone number"
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Create a password"
            className="border rounded-lg px-3 py-2 w-full"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`border rounded-lg p-3 cursor-pointer transition ${
              selectedRole === "user" ? "border-emerald-500 bg-emerald-50" : "hover:bg-slate-50"
            }`}>
              <input
                type="radio"
                {...register("role")}
                value="user"
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-2xl">🏠</span>
                <p className="font-medium text-sm mt-1">Looking for PG</p>
              </div>
            </label>
            <label className={`border rounded-lg p-3 cursor-pointer transition ${
              selectedRole === "owner" ? "border-emerald-500 bg-emerald-50" : "hover:bg-slate-50"
            }`}>
              <input
                type="radio"
                {...register("role")}
                value="owner"
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-2xl">🔑</span>
                <p className="font-medium text-sm mt-1">PG Owner</p>
              </div>
            </label>
          </div>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-emerald-600 text-white w-full py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {mutation.isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
