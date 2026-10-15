"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, Loader2 } from "lucide-react";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/admin/auth/login", values);
      if (data.success) {
        localStorage.setItem("adminToken", data.data.token);
        toast.success(`Welcome back, ${data.data.admin.name}`);
        router.replace("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
      if (axios.isAxiosError(err) && !err.response) {
        toast.error("Server unreachable. Is the API running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-800 to-navy-900 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-extrabold text-navy-900">
            GreenLand <span className="font-light">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-navy-500">Sign in to manage your listings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input id="email" className="input pl-9" placeholder="admin@example.com" {...register("email")} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                id="password"
                type="password"
                className="input pl-9"
                placeholder="••••••••"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-navy-100 pt-5 text-center text-sm text-navy-600">
          Need an account?{" "}
          <Link
            href="/admin/register"
            className="font-bold text-forest-800 hover:text-gold-600 hover:underline"
          >
            Sign up here
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs text-navy-400 hover:text-navy-700"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
