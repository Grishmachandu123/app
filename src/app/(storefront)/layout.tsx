import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { getSiteSettings } from "@/lib/queries";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header businessName={settings.business_name} whatsappNumber={settings.whatsapp_number} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
