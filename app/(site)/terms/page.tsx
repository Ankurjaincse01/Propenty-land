import type { Metadata } from "next";
import { loadSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern your use of this website.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await loadSettings();

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <h1 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
      <div className="section max-w-3xl py-12">
        <div className="space-y-8 rounded-2xl border border-navy-100 bg-white p-8 shadow-soft">
          <Section title="1. Acceptance">
            By using this website you agree to these terms. If you do not agree, please do not
            use the site.
          </Section>
          <Section title="2. Nature of the website">
            This is a demonstration website. Listings shown are sample (demo) data and do not
            constitute real property offers. Do not rely on them for any transaction.
          </Section>
          <Section title="3. Information accuracy">
            Plot details, pricing and availability are subject to change and confirmation.
            Always verify measurements, pricing and documents before making decisions.
          </Section>
          <Section title="4. No legal or ownership assurance">
            We do not represent or warrant approvals, clearances or ownership unless such
            information is supplied and confirmed by the property owner. We make no legal
            claims on the owner's behalf.
          </Section>
          <Section title="5. Limitation of liability">
            {settings.businessName} is not liable for any loss arising from reliance on the
            information presented on this website.
          </Section>
          <Section title="6. Contact">
            Questions about these terms? Email {settings.email}.
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
