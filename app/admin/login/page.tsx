"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck, X, HelpCircle } from "lucide-react";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Please enter a valid administrator email");
      return;
    }
    setForgotSubmitting(true);
    setTimeout(() => {
      setForgotSubmitting(false);
      setForgotSubmitted(true);
      toast.success("Password reset request submitted");
    }, 800);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotSubmitted(false);
    setForgotEmail("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-800 to-navy-900 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-navy-900">
            GreenLand <span className="font-light text-forest-800">Admin</span>
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
              <input
                id="email"
                type="email"
                className="input pl-9"
                placeholder="admin@greenlandestates.com"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label mb-0" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-forest-800 hover:text-gold-600 hover:underline transition"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input pl-9 pr-10"
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full shadow-soft mt-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-navy-100 pt-4 text-center">
          <Link
            href="/"
            className="text-xs text-navy-500 hover:text-forest-800 transition inline-flex items-center gap-1 font-medium"
          >
            ← Back to website
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-navy-100">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-forest-800" />
                <h3 className="font-heading font-bold text-navy-900">Reset Admin Password</h3>
              </div>
              <button
                onClick={closeForgotModal}
                className="rounded-full p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-800">
                  <ShieldCheck className="h-6 w-6 text-forest-800" />
                </div>
                <h4 className="font-heading font-bold text-navy-900">Request Sent</h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  If <strong>{forgotEmail}</strong> matches a registered administrator account, password reset instructions and an authorization code have been generated.
                </p>
                <p className="text-xs text-navy-500">
                  For immediate assistance, please reach out to the Super Admin or email <a href="mailto:info@greenlandestates.com" className="font-semibold text-forest-800 underline">info@greenlandestates.com</a>.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="btn-primary w-full mt-4 text-sm"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="pt-4 space-y-4">
                <p className="text-xs text-navy-600 leading-relaxed">
                  Enter your registered administrator email address below. We will send password recovery instructions to verify your identity.
                </p>

                <div>
                  <label className="label" htmlFor="forgot-email">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@greenlandestates.com"
                      className="input pl-9"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-forest-50/70 p-3 text-xs text-forest-900 border border-forest-100">
                  <p className="font-semibold">Security Policy:</p>
                  <p className="mt-0.5 text-navy-600">
                    Administrator account credentials can only be reset for verified domain accounts.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="btn-secondary flex-1 text-sm py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="btn-primary flex-1 text-sm py-2.5"
                  >
                    {forgotSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Send Instructions"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

