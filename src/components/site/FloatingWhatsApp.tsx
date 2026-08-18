import { WhatsAppIcon } from "@/components/ui/icons";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export default function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a
      href={whatsappLink(whatsappNumber, GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full
        bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105 md:h-16 md:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" width={28} height={28} />
    </a>
  );
}
