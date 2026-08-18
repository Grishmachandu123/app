"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: settings?.business_name ?? "Vasthra Boutique",
    whatsapp_number: settings?.whatsapp_number ?? "",
    instagram_url: settings?.instagram_url ?? "",
    contact_information: settings?.contact_information ?? "",
    about_text: settings?.about_text ?? "",
    logo_url: settings?.logo_url ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const payload = {
      business_name: form.business_name.trim(),
      whatsapp_number: form.whatsapp_number.replace(/\D/g, ""),
      instagram_url: form.instagram_url.trim() || null,
      contact_information: form.contact_information.trim() || null,
      about_text: form.about_text.trim() || null,
      logo_url: form.logo_url.trim() || null,
    };

    try {
      const supabase = createClient();
      const { error: saveError } = settings
        ? await supabase.from("site_settings").update(payload).eq("id", settings.id)
        : await supabase.from("site_settings").insert(payload);
      if (saveError) throw new Error(saveError.message);

      setStatus("saved");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save settings.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="business_name">
          Business name
        </label>
        <input
          id="business_name"
          required
          className="input"
          value={form.business_name}
          onChange={(event) => update("business_name", event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="whatsapp_number">
          WhatsApp number (with country code, digits only)
        </label>
        <input
          id="whatsapp_number"
          required
          inputMode="numeric"
          placeholder="919876543210"
          className="input"
          value={form.whatsapp_number}
          onChange={(event) => update("whatsapp_number", event.target.value)}
        />
        <p className="mt-1 text-xs text-ink-700">Example: 919876543210 for +91 98765 43210.</p>
      </div>

      <div>
        <label className="label" htmlFor="instagram_url">
          Instagram URL
        </label>
        <input
          id="instagram_url"
          type="url"
          className="input"
          value={form.instagram_url}
          onChange={(event) => update("instagram_url", event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="contact_information">
          Contact information
        </label>
        <textarea
          id="contact_information"
          rows={3}
          className="input"
          value={form.contact_information}
          onChange={(event) => update("contact_information", event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="about_text">
          About text
        </label>
        <textarea
          id="about_text"
          rows={5}
          className="input"
          value={form.about_text}
          onChange={(event) => update("about_text", event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="logo_url">
          Logo URL
        </label>
        <input
          id="logo_url"
          type="url"
          className="input"
          value={form.logo_url}
          onChange={(event) => update("logo_url", event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-maroon-600/10 px-4 py-3 text-sm text-maroon-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? "Saving…" : "Save settings"}
        </button>
        {status === "saved" && <span className="text-sm text-green-700">Saved.</span>}
      </div>
    </form>
  );
}
