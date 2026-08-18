"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import SearchBar from "@/components/site/SearchBar";
import { CloseIcon, MenuIcon, SearchIcon, WhatsAppIcon } from "@/components/ui/icons";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sarees", label: "Sarees" },
  { href: "/one-gram-gold", label: "One-Gram Gold" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  businessName,
  whatsappNumber,
}: {
  businessName: string;
  whatsappNumber: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/80 bg-cream-50/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-wide text-ink-900 md:text-2xl">{businessName}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-gold-500 ${
                isActive(link.href) ? "text-gold-500" : "text-ink-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="rounded-full p-2.5 text-ink-800 hover:bg-cream-200"
          >
            {searchOpen ? <CloseIcon width={20} height={20} /> : <SearchIcon />}
          </button>

          <a
            href={whatsappLink(whatsappNumber, GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hidden px-4 py-2 sm:inline-flex"
          >
            <WhatsAppIcon width={18} height={18} />
            WhatsApp
          </a>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2.5 text-ink-800 hover:bg-cream-200 lg:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-cream-300/80 bg-cream-100">
          <div className="container-page py-3">
            <SearchBar onSubmitted={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="border-t border-cream-300/80 bg-cream-50 lg:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b border-cream-200 py-3 text-base ${
                  isActive(link.href) ? "text-gold-500" : "text-ink-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink(whatsappNumber, GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp my-4"
            >
              <WhatsAppIcon />
              Chat with us on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
