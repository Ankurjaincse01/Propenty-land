"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  customerName: z.string().min(2, "Please enter your name"),
  phone: z
    .string()
    .min(8, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  preferredVisitDate: z.string().optional().or(z.literal("")),
  message: z.string().min(5, "Please add a short message"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  propertyId?: string;
  projectId?: string;
  source?: "Property Page" | "Project Page" | "Contact Page" | "Quick Callback";
  defaultMessage?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function EnquiryForm({
  propertyId,
  projectId,
  source = "Property Page",
  defaultMessage = "",
  compact = false,
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: defaultMessage },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/enquiries", {
        ...values,
        property: propertyId,
        project: projectId,
        source,
      });
      if (data.success) {
        toast.success("Enquiry sent! Our team will contact you shortly.");
        reset({ message: defaultMessage });
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not send enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field = "input";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <div className={cn(compact ? "space-y-3.5" : "grid grid-cols-1 gap-3.5 sm:grid-cols-2")}>
        <div>
          <label className="label" htmlFor="customerName">
            Full Name *
          </label>
          <input
            id="customerName"
            placeholder="Your name"
            className={field}
            {...register("customerName")}
          />
          {errors.customerName && (
            <p className="mt-1 text-xs text-rose-600">{errors.customerName.message}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className={field}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className={cn(compact ? "space-y-3.5" : "grid grid-cols-1 gap-3.5 sm:grid-cols-2")}>
        <div>
          <label className="label" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@email.com"
            className={field}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="preferredVisitDate">
            Preferred Site Visit
          </label>
          <input
            id="preferredVisitDate"
            type="date"
            className={field}
            {...register("preferredVisitDate")}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          rows={compact ? 3 : 4}
          placeholder="Tell us what you're looking for…"
          className={cn(field, "resize-none")}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-rose-600">{errors.message.message}</p>
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit Enquiry
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-navy-400">
        Your details are kept private and used only to respond to your enquiry.
      </p>
    </form>
  );
}
