import type { HTTPValidationError } from "@/types/api";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }

  get validationErrors() {
    const detail = this.detail as HTTPValidationError["detail"] | undefined;
    return Array.isArray(detail) ? detail : null;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  form?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
}

function buildQuery(params?: RequestOptions["params"]) {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) usp.set(key, String(value));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { json, form, params, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  let body: BodyInit | undefined;

  if (json !== undefined) {
    finalHeaders.set("content-type", "application/json");
    body = JSON.stringify(json);
  } else if (form) {
    finalHeaders.set("content-type", "application/x-www-form-urlencoded");
    body = new URLSearchParams(form).toString();
  }

  const res = await fetch(`/api/reception/${path}${buildQuery(params)}`, {
    ...rest,
    headers: finalHeaders,
    body,
    credentials: "include",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? data.detail
        : data;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((e: { msg?: string }) => e.msg)
              .filter(Boolean)
              .join("; ") || res.statusText
          : res.statusText;
    throw new ApiError(res.status, message, detail);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT" }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
