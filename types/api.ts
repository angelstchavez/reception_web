export type Role = "admin" | "guard" | "student" | "professor" | "visitor";

export type EventType = "entry" | "exit";

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  access_expires_at: string | null;
  created_at: string;
}

export interface UserRegister {
  email: string;
  full_name: string;
  password: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role: Role;
}

export interface VisitorCreate {
  email: string;
  full_name: string;
  password: string;
  access_expires_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  card_credential: string | null;
}

export type PublicTokenInfo = Pick<TokenPair, "token_type" | "card_credential">;

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface ScanRequest {
  credential: string;
}

export interface ScanResponse {
  event_type: EventType;
  recorded_at: string;
  user: UserRead;
}

export interface AccessEventRead {
  id: string;
  user_id: string;
  event_type: EventType;
  recorded_by_user_id: string;
  recorded_at: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ListEventsParams {
  limit?: number;
  offset?: number;
}

export interface ListAllEventsParams extends ListEventsParams {
  user_id?: string;
}
