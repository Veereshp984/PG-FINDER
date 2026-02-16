import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import { useAuth } from "../state/AuthContext.jsx";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "owner"]).default("user")
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" }
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/");
    }
  });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="border rounded-lg px-3 py-2 w-full" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        <input {...register("email")} placeholder="Email" className="border rounded-lg px-3 py-2 w-full" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        <input type="password" {...register("password")} placeholder="Password" className="border rounded-lg px-3 py-2 w-full" />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        <select {...register("role")} className="border rounded-lg px-3 py-2 w-full">
          <option value="user">Looking for PG</option>
          <option value="owner">I own a PG</option>
        </select>
        <button type="submit" className="bg-emerald-600 text-white w-full py-2 rounded-lg">Register</button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-emerald-600">Login</Link>
      </p>
    </div>
  );
};

export default Register;
