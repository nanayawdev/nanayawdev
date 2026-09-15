/**
 * Wire types for Hubtel's Programmable Services USSD contract.
 *
 * Two URLs get registered against your Hubtel USSD short code:
 *  - Service Interaction URL  -> POST /api/ussd/interaction  (this file's ProgrammableServiceRequest/Response)
 *  - Service Fulfilment URL   -> POST /api/ussd/fulfilment   (this file's ProgrammableServiceFulfilmentRequest)
 *
 * Field names/casing are taken verbatim from Hubtel's own SDK source
 * (github.com/hubtel/programmable-services-sdk-dotnet), not guessed —
 * their JSON serializer keeps C# property names as-is (PascalCase).
 */

/** Every value Hubtel may send in an interaction request's `Type` field. */
export type ProgrammableServiceRequestType =
  | "Initiation" | "initiation"
  | "Response" | "response"
  | "Release" | "release"
  | "Timeout" | "timeout"
  | "Query" | "query"
  | "Favorite" | "favorite";

/** POST body Hubtel sends to the Service Interaction URL on every keypress. */
export interface ProgrammableServiceRequest {
  SessionId: string;
  ServiceCode: string;
  Type: ProgrammableServiceRequestType;
  /** Initiation: the raw dial string (e.g. "*713#"). Response: the user's typed input for the current screen. */
  Message: string;
  /** e.g. "mtn-gh", "vodafone", "airteltigo-gh", or a platform id for non-USSD channels. */
  Operator?: string;
  /** "USSD" | "Web" | "Hubtel-App" | "Hubtel-POS" */
  Platform?: string;
  Mobile: string;
  /** Opaque string we set on our previous response; echoed back verbatim. */
  ClientState?: string;
  Sequence?: number;
  ExtraData?: Record<string, unknown>;
}

export interface ProgrammableServicesResponseCartData {
  ItemName: string;
  Qty: number;
  Price: number;
  ItemId?: string;
  /** Carried through to the Fulfilment callback's ExtraData — this is how we thread our own event/registration ids through a Hubtel-hosted checkout. */
  ServiceData?: Record<string, string>;
}

/** JSON we return from the Service Interaction URL. */
export interface ProgrammableServiceResponse {
  /** "Response" = show another screen & wait for input. "Release" = end the session (optionally with Item set to start a USSD checkout). */
  Type: "Response" | "Release";
  Message: string;
  Label?: string;
  ClientState?: string;
  /** "menu" | "select" | "display" | "input" | "confirm" */
  DataType?: "menu" | "select" | "display" | "input" | "confirm";
  /** Only meaningful when DataType is "input". */
  FieldType?: "text" | "phone" | "email" | "number" | "decimal" | "textarea";
  FieldName?: string;
  Item?: ProgrammableServicesResponseCartData;
}

export interface PaidOrderInfoItem {
  ItemId: string;
  Name: string;
  Quantity: number;
  UnitPrice: number;
}

export interface PaidOrderPaymentInfo {
  PaymentType?: string;
  PaymentDescription?: string;
  IsSuccessful: boolean;
  AmountPaid: number;
  PaymentDate?: string;
}

export interface PaidOrderInfo {
  CustomerMobileNumber: string;
  CustomerName?: string;
  Status?: string;
  Currency?: string;
  BranchName?: string;
  IsRecurring?: boolean;
  RecurringInvoiceId?: string;
  OrderDate?: string;
  Items: PaidOrderInfoItem[];
  Payment: PaidOrderPaymentInfo;
}

/** POST body Hubtel sends to the Service Fulfilment URL once a USSD checkout (started by a "Release" + Item response) completes. */
export interface ProgrammableServiceFulfilmentRequest {
  OrderId: string;
  SessionId: string;
  OrderInfo: PaidOrderInfo;
  /** Echoes back whatever we put in the cart Item's ServiceData at checkout time. */
  ExtraData?: Record<string, string>;
}

export function normalizeType(type: string | undefined): string {
  return (type ?? "").toLowerCase();
}
