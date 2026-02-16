import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.js";
import { useAuth } from "../state/AuthContext.jsx";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/");
    }
  });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-slate-500 mt-1">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4 bg-white border rounded-xl p-6">
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
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="border rounded-lg px-3 py-2 w-full"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            Invalid email or password. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-emerald-600 text-white w-full py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-emerald-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
