import { business } from "@/data/business";

export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden border border-navy/12 ${className}`}
    >
      <iframe
        title={`${business.name} — Google Maps`}
        src={business.googleMapsEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full min-h-[280px] border-0"
      />
    </div>
  );
}
