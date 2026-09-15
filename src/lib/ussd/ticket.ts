import crypto from "crypto";

// Excludes visually ambiguous characters (0/O, 1/I/L) since ticket codes get
// read aloud at the gate and typed back in over USSD.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function genTicketCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  return code;
}

export function genPin(): string {
  return String(crypto.randomInt(0, 10_000)).padStart(4, "0");
}

export function genReportNumber(prefix: "R" | "L"): string {
  let n = "";
  for (let i = 0; i < 5; i++) n += crypto.randomInt(10);
  return `${prefix}-${n}`;
}

export function priceLabel(amount: number | string, currency: string): string {
  const n = Number(amount);
  return n > 0 ? `${currency} ${n.toFixed(2)}` : "Free";
}

export function shortDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra", day: "2-digit", month: "short", hour: "numeric", minute: "2-digit",
  }).format(new Date(iso));
}
