export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Reception Web";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Base URL used only by the server-side API gateway. */
export const RECEPTION_API_URL = (
  process.env.RECEPTION_API_URL || "http://localhost:8000"
).replace(/\/$/, "");
