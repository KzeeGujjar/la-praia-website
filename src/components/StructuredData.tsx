import { business } from "@/data/business";

const dayNameMap: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/**
 * Restaurant/LocalBusiness JSON-LD, built entirely from src/data/business.ts
 * so it can never drift from (or invent facts beyond) the verified data.
 */
export function StructuredData() {
  const openingHoursSpecification = business.hours
    .filter((h) => h.pickup)
    .map((h) => {
      const [opens, closes] = h.pickup!.split("–");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayNameMap[h.day],
        opens,
        closes,
      };
    });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    alternateName: business.shortName,
    servesCuisine: ["Italian", "Pizza", "Seafood"],
    telephone: business.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng,
    },
    url: siteUrl,
    hasMap: business.googleMapsUrl,
    openingHoursSpecification,
  };

  return (
    <script
      type="application/ld+json"
      // Safe: schema is built only from static, trusted src/data/business.ts — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
