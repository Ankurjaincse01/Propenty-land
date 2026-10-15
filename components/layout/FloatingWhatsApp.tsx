"use client";

import { MessageCircle } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

export default function FloatingWhatsApp({
  whatsappNumber,
  businessName,
}: {
  whatsappNumber: string;
  businessName: string;
}) {
  const url = generateWhatsAppUrl(
    whatsappNumber,
    `Hello ${businessName}, I'm interested in your plots. Please share available options.`
  );
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card transition hover:scale-105 hover:bg-emerald-600"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
    </a>
  );
}
