import Link from "next/link";

import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { SiteSettings } from "@/lib/types";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-20 border-t border-cream-300 bg-cream-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-serif text-2xl">{settings.business_name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-700">
            Handpicked sarees and one-gram gold jewellery, curated for weddings, festivals and everyday
            elegance.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={whatsappLink(settings.whatsapp_number, GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="rounded-full border border-cream-300 bg-white p-2.5 text-[#25D366] hover:border-gold-200"
            >
              <WhatsAppIcon />
            </a>
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-cream-300 bg-white p-2.5 text-ink-800 hover:border-gold-200"
              >
                <InstagramIcon />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            <li>
              <Link href="/sarees" className="hover:text-gold-500">
                Sarees
              </Link>
            </li>
            <li>
              <Link href="/one-gram-gold" className="hover:text-gold-500">
                One-Gram Gold Jewellery
              </Link>
            </li>
            <li>
              <Link href="/new-arrivals" className="hover:text-gold-500">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-gold-500">
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Boutique</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            <li>
              <Link href="/about" className="hover:text-gold-500">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Get in touch</h4>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-700">
            {settings.contact_information ?? "WhatsApp us for orders and enquiries."}
          </p>
          <a
            href={whatsappLink(settings.whatsapp_number, GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4 w-full sm:w-auto"
          >
            <WhatsAppIcon />
            Chat with us
          </a>
        </div>
      </div>

      <div className="border-t border-cream-300">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-700 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <p>Orders and enquiries are handled personally on WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
