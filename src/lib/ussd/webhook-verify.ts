import crypto from "crypto";

/**
 * Verifies SendrPlus's inbound request signature — confirmed against
 * /Users/ny/sendrplus/api/internal/ussd/interaction_forward.go (the
 * signer) and cmd/eventussd/main.go (the reference verifier this mirrors):
 *
 *   mac := hmac.New(sha512.New, []byte(signingSecret))
 *   mac.Write(body)
 *   signature := hex.EncodeToString(mac.Sum(nil))
 *   header: X-SendrPlus-Signature
 *
 * Notably NOT the Svix/"Standard Webhooks" scheme the `whsec_...` prefix
 * might suggest — no timestamp header, no id header, no constructed
 * "id.timestamp.body" signed string. Just HMAC-SHA512 over the raw body
 * bytes, hex-encoded, keyed by the full secret string (including the
 * `whsec_` prefix — it's used as-is, not stripped/decoded). There is
 * also no replay protection, by SendrPlus's own design.
 */
export function verifySendrPlusSignature(secret: string, signatureHeader: string | null, rawBody: string): boolean {
  if (!signatureHeader) return false;
  const mac = crypto.createHmac("sha512", secret).update(rawBody, "utf8").digest("hex");
  const expected = Buffer.from(mac, "hex");
  let provided: Buffer;
  try {
    provided = Buffer.from(signatureHeader, "hex");
  } catch {
    return false;
  }
  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}
