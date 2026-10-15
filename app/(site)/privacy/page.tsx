import type { Metadata } from "next";
import { loadSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect the information you provide.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await loadSettings();

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <h1 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
      <div className="section max-w-3xl py-12">
        <div className="space-y-8 rounded-2xl border border-navy-100 bg-white p-8 shadow-soft">
          <Section title="1. Introduction">
            {settings.businessName} respects your privacy. This policy explains what
            information we collect through this website and how we use it.
          </Section>
          <Section title="2. Information we collect">
            We collect the details you submit through enquiry forms — your name, phone
            number, optional email address, optional preferred visit date, and your message.
            We also collect limited technical data required to operate and secure the site.
          </Section>
          <Section title="3. How we use your information">
            Your information is used solely to respond to your enquiry, share plot details
            and coordinate site visits. Enquiries are stored in our database and are visible
            only to authorised admin users.
          </Section>
          <Section title="4. Sharing">
            We do not sell your personal information. We do not publish customer contact
            details on the public website.
          </Section>
          <Section title="5. Data retention & security">
            Enquiries are retained for as long as needed to serve you. Access is protected by
            authentication and administrative controls.
          </Section>
          <Section title="6. Contact">
            For any privacy request, email us at {settings.email} or call {settings.phone}.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-bold text-navy-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">{children}</p>
    </section>
  );
}
