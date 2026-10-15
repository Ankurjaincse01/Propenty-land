"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function AdminRegisterPage() {
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
      const { data } = await api.post("/admin/auth/register", values);
      if (data.success) {
        localStorage.setItem("adminToken", data.data.token);
        toast.success(`Account created! Welcome, ${data.data.admin.name}`);
        router.replace("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
      if (axios.isAxiosError(err) && !err.response) {
        toast.error("Server unreachable. Is the API running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-900 via-navy-900 to-navy-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-navy-900">
            Create an <span className="font-light text-forest-800">Account</span>
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            Sign up to manage GreenLand Estates plots &amp; projects
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                id="name"
                className="input pl-9"
                placeholder="e.g. Ramesh Sharma"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                id="email"
                type="email"
                className="input pl-9"
                placeholder="you@greenlandestates.com"
                {...register("email")}
              />
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
                placeholder="Minimum 6 characters"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full shadow-soft"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
              </>
            ) : (
              <>
                Create Account <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-navy-100 pt-5 text-center text-sm text-navy-600">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="font-bold text-forest-800 hover:text-gold-600 hover:underline"
          >
            Sign in here
          </Link>
        </div>

        <div className="mt-4 text-center">
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
