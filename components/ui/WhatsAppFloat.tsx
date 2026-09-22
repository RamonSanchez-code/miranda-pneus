import { whatsappLink, defaultQuoteMessage } from "@/lib/contact";

export function WhatsAppFloat() {
  return (
    <a className="wa" href={whatsappLink(defaultQuoteMessage)} target="_blank" rel="noopener noreferrer" aria-label="Fale com a Miranda no WhatsApp">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden>
        <path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-2c1.8 1 3.8 1.500 5.900 1.500 6.900 0 12.500-5.600 12.500-12.500S22.900 3 16 3zm0 22.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.200 1.200-4.300-.3-.4a10.300 10.300 0 0 1-1.600-5.500C5.200 9.700 10 5 16 5s10.800 4.700 10.800 10.500S21.900 25.900 16 25.900zm5.900-7.700c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100c-1.900-.9-3.100-1.700-4.300-3.800-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1 1-1 2.500s1.100 2.900 1.200 3.100c.2.200 2.100 3.300 5.200 4.600 1.900.8 2.700.9 3.600.7.600-.1 1.900-.8 2.100-1.500.3-.7.300-1.400.2-1.500-.1-.1-.3-.2-.6-.4z" />
      </svg>
      <span>Fale com a Miranda</span>
    </a>
  );
}
