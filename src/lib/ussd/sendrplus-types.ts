/**
 * Wire types for SendrPlus's own USSD platform (the user's own product,
 * not a third-party gateway) — confirmed against
 * /Users/ny/sendrplus/api/internal/ussd/interaction_forward.go,
 * fulfillment.go, and the cmd/eventussd reference vendor server.
 *
 * Integration direction: SendrPlus sits between MTN and this site.
 * SendrPlus's backend calls OUT to the two routes below on every USSD
 * turn (Interaction) and once after a session ends (Fulfillment,
 * optional) — this site never calls into SendrPlus to drive a session.
 *
 * Unlike Hubtel, SendrPlus does NOT do any payment collection on the
 * USSD leg (no cart/Item/price, no OrderInfo) — a vendor handles payment
 * entirely on its own. See registration.ts / flow.ts for how that's
 * handled here (Cash at Gate only, for now).
 */

export interface InteractionApplication {
  id: string;
  name: string;
  extension: string;
}

/** POST body SendrPlus sends to the Interaction URL on every keypress. */
export interface InteractionRequest {
  session_id: string;
  phone_number: string;
  /** First turn: always "". Later turns: the caller's latest keystroke only (already de-accumulated). */
  input: string;
  /** true only on the very first turn of a session. */
  new_session: boolean;
  application: InteractionApplication;
}

/** JSON this site must return from the Interaction URL, within SendrPlus's ~4s budget. */
export interface InteractionResponse {
  /** Must be non-empty — SendrPlus treats an empty message as an error. */
  message: string;
  /** true = show another screen and wait for the next keypress. false = end the session; `message` is the final screen. */
  continue_session: boolean;
}

/** POST body SendrPlus sends to the (optional) Fulfillment URL once, asynchronously, after the session already ended. */
export interface FulfillmentPayload {
  session_id: string;
  phone_number: string;
  /** The final message this site's Interaction URL sent when it set continue_session: false. */
  message: string;
  /** Always {} in the current SendrPlus build — nothing to read from here today. */
  data: Record<string, string>;
  application: InteractionApplication;
}
