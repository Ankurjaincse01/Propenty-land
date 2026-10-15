"use client";

import { MessageCircle } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  phone: string;
  message: string;
  label?: string;
  className?: string;
  variant?: "solid" | "outline";
}

export default function WhatsAppButton({
  phone,
  message,
  label = "Enquire on WhatsApp",
  className,
  variant = "solid",
}: Props) {
  return (
    <a
      href={generateWhatsAppUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        variant === "solid"
          ? "btn bg-emerald-600 text-white hover:bg-emerald-700"
          : "btn border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        className
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
