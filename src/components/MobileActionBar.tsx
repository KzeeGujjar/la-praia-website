"use client";

import { ContactButtons } from "@/components/ContactButtons";

/**
 * Persistent call/WhatsApp bar on small screens, so reserving a table is
 * always one tap away no matter how far the visitor has scrolled.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-sand/95 px-3 py-2.5 backdrop-blur md:hidden [padding-bottom:calc(0.625rem+env(safe-area-inset-bottom))]">
      <ContactButtons compact />
    </div>
  );
}
