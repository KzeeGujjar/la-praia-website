/**
 * Static business data for La Praia. No backend/database — this file is the
 * single source of truth for contact info, hours, and location, sourced from
 * the restaurant's public listings (verify periodically; hours/phone can change).
 */

export const business = {
  name: "Ristorante Pizzeria La Praia",
  shortName: "La Praia",
  address: {
    street: "Via Camillo Casarini, 10",
    postalCode: "40131",
    city: "Bologna",
    country: "Italia",
  },
  // Sourced directly from the restaurant's Google Maps place URL below.
  coordinates: { lat: 44.503578, lng: 11.3319285 },
  // E.164, no spaces — used for tel: and wa.me links
  phoneDisplay: "+39 051 558927",
  phoneE164: "+39051558927",
  whatsappE164: "39051558927",
  googleMapsUrl:
    "https://www.google.com/maps/place/La+Praia/@44.503578,11.3319285,17z/data=!4m16!1m8!3m7!1s0x477fd485aca473f7:0x5929c99a8e592c67!2sLa+Praia!8m2!3d44.503578!4d11.3319285!10e9!16s%2Fg%2F1tcvy7xt!3m6!1s0x477fd485aca473f7:0x5929c99a8e592c67!8m2!3d44.503578!4d11.3319285!10e9!16s%2Fg%2F1tcvy7xt!18m1!1e1",
  googleMapsEmbedSrc:
    "https://www.google.com/maps?q=Ristorante+Pizzeria+La+Praia,+Via+Camillo+Casarini+10,+Bologna&output=embed",
  deliveryPostalCodes: ["40121", "40122", "40129", "40131"],
  hours: [
    { day: "monday", pickup: null, delivery: null },
    { day: "tuesday", pickup: "18:50–22:00", delivery: "18:50–22:00" },
    { day: "wednesday", pickup: "18:50–22:00", delivery: "18:50–22:00" },
    { day: "thursday", pickup: "18:50–22:00", delivery: "18:50–22:00" },
    { day: "friday", pickup: "18:50–22:00", delivery: "18:50–22:00" },
    { day: "saturday", pickup: "18:50–22:00", delivery: "18:20–22:00" },
    { day: "sunday", pickup: "18:50–22:00", delivery: "18:20–22:00" },
  ] as const,
} as const;

export type DayKey = (typeof business.hours)[number]["day"];
