import { randomBytes } from "node:crypto";

// Excludes visually-ambiguous characters (0/O, 1/I/L) since this gets read
// aloud over the phone and typed back in by customers looking up a booking.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateConfirmationCode(length = 8): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}
