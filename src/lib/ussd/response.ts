import type { InteractionResponse } from "./sendrplus-types";

/** Show a screen and keep the session open, waiting for the next keypress. */
export function continueSession(message: string): InteractionResponse {
  return { message, continue_session: true };
}

/** End the session with a final message — no further input expected. */
export function endSession(message: string): InteractionResponse {
  return { message, continue_session: false };
}
