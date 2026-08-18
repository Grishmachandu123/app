import type { Metadata } from "next";
import Link from "next/link";

import { SparkleIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getSiteSettings } from "@/lib/queries";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A small family run boutique offering handpicked sarees and one-gram gold jewellery, with personal service on WhatsApp.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="eyebrow">Our Story</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">About {settings.business_name}</h1>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-700">
          {settings.about_text}
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Handpicked Sarees",
            body: "Pattu, silk, cotton and designer sarees chosen weave by weave for quality and drape.",
          },
          {
            title: "One-Gram Gold Jewellery",
            body: "Traditional temple designs with a rich finish, at a price that suits every celebration.",
          },
          {
            title: "Personal Service",
            body: "We send real photos and videos on WhatsApp, and help you pick matching sets.",
          },
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <SparkleIcon className="h-6 w-6 text-gold-400" />
            <h2 className="mt-4 text-xl">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-gold-200 bg-cream-100 px-6 py-12 text-center">
        <h2 className="text-3xl">Come say hello</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-700">
          Browse the collections and message us on WhatsApp — we reply personally.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/sarees" className="btn-primary">
            Shop Sarees
          </Link>
          <a
            href={whatsappLink(settings.whatsapp_number, GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon />
            Chat with us
          </a>
        </div>
      </div>
    </div>
  );
}
