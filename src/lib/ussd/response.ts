import type { ProgrammableServiceResponse, ProgrammableServicesResponseCartData } from "./hubtel-types";

/** Show a screen and keep the session open, waiting for the next keypress. */
export function menu(message: string, clientState: string): ProgrammableServiceResponse {
  return { Type: "Response", Message: message, ClientState: clientState, DataType: "menu" };
}

/** Show a free-text/number prompt and keep the session open. */
export function input(
  message: string,
  clientState: string,
  fieldName: string,
  fieldType: ProgrammableServiceResponse["FieldType"] = "text",
): ProgrammableServiceResponse {
  return { Type: "Response", Message: message, ClientState: clientState, DataType: "input", FieldType: fieldType, FieldName: fieldName };
}

/** End the session with a final message — no further input expected. */
export function release(message: string): ProgrammableServiceResponse {
  return { Type: "Release", Message: message, DataType: "display" };
}

/**
 * End the session and hand off to Hubtel's own mobile money checkout.
 * On the USSD channel, checkout is triggered by a "Release" response that
 * carries a cart Item — NOT by Type "AddToCart" (that's only for the
 * Web/App/POS channels). Hubtel calls the Service Fulfilment URL once the
 * customer completes (or fails) the payment prompt.
 */
export function releaseWithCheckout(message: string, item: ProgrammableServicesResponseCartData): ProgrammableServiceResponse {
  return { Type: "Release", Message: message, DataType: "display", Item: item };
}
