import type { Metadata } from "next";

import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getSiteSettings } from "@/lib/queries";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact our boutique on WhatsApp for sarees and one-gram gold jewellery orders.",
  alternates: { canonical: "/contact" },
};

const HOW_TO_ORDER = [
  "Browse the sarees or one-gram gold collections.",
  "Open a product and check the photos, price and details.",
  "Tap “Order on WhatsApp” — the product name, ID and price are filled in for you.",
  "Send us your name, full address and pincode on WhatsApp.",
  "We confirm availability, total amount and dispatch your order.",
];

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">We are a message away</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          All orders and enquiries are handled personally on WhatsApp — there is no online payment or
          account to create.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <h2 className="text-2xl">Reach us</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-700">
            {settings.contact_information ?? "WhatsApp us any day between 10 AM and 8 PM."}
          </p>
          <p className="mt-4 text-sm text-ink-700">
            WhatsApp: <span className="text-ink-900">+{settings.whatsapp_number.replace(/\D/g, "")}</span>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(settings.whatsapp_number, GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon />
              Chat with us on WhatsApp
            </a>
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <InstagramIcon width={18} height={18} />
                Instagram
              </a>
            )}
          </div>
        </div>

        <div className="card p-7">
          <h2 className="text-2xl">How ordering works</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
            {HOW_TO_ORDER.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-semibold text-gold-600">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
