import SettingsForm from "@/components/admin/SettingsForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("site_settings").select("*").limit(1).maybeSingle()
    : { data: null };

  return (
    <div>
      <p className="eyebrow">Configuration</p>
      <h1 className="mt-2 text-3xl">Site settings</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-700">
        The WhatsApp number below powers every “Order on WhatsApp” button across the website.
      </p>

      <div className="mt-6 max-w-2xl">
        <SettingsForm settings={data as SiteSettings | null} />
      </div>
    </div>
  );
}
