import { NextRequest, NextResponse } from "next/server";
import { RECEPTION_API_URL } from "@/lib/env";
import type { TokenPair } from "@/types/api";

const ACCESS_COOKIE = "rap_access_token";
const REFRESH_COOKIE = "rap_refresh_token";
const BLOCKED_PATH = "access-events/scan";

type GatewayContext = { params: Promise<{ path: string[] }> };

function apiUrl(request: NextRequest, path: string[]) {
  const url = new URL(`${RECEPTION_API_URL}/${path.join("/")}`);
  url.search = request.nextUrl.search;
  return url;
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

function copyResponse(upstream: Response) {
  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  return upstream.arrayBuffer().then(
    (body) => new NextResponse(body, { status: upstream.status, headers }),
  );
}

async function upstreamRequest(
  request: NextRequest,
  path: string[],
  accessToken?: string,
  requestBody?: ArrayBuffer,
) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  return fetch(apiUrl(request, path), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : requestBody,
    cache: "no-store",
  });
}

async function refreshTokens(request: NextRequest, refreshToken: string) {
  const response = await fetch(`${RECEPTION_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as TokenPair;
}

function setSession(response: NextResponse, tokens: TokenPair) {
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, sessionCookieOptions());
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, sessionCookieOptions());
}

function clearSession(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

async function handle(request: NextRequest, context: GatewayContext) {
  const { path } = await context.params;
  const pathname = path.join("/");
  const requestBody = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  if (pathname === BLOCKED_PATH) {
    return NextResponse.json({ detail: "La función de escaneo no está disponible." }, { status: 404 });
  }

  if (pathname === "auth/login" && request.method === "POST") {
    const upstream = await upstreamRequest(request, path, undefined, requestBody);
    const tokens = upstream.ok
      ? ((await upstream.clone().json()) as TokenPair)
      : null;
    if (!tokens) return copyResponse(upstream);

    const response = NextResponse.json({
      token_type: tokens.token_type,
      card_credential: tokens.card_credential,
    });
    setSession(response, tokens);
    return response;
  }

  if (pathname === "auth/refresh" && request.method === "POST") {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) return NextResponse.json({ detail: "Sesión no disponible." }, { status: 401 });
    const tokens = await refreshTokens(request, refreshToken);
    if (!tokens) {
      const response = NextResponse.json({ detail: "Sesión expirada." }, { status: 401 });
      clearSession(response);
      return response;
    }
    const response = NextResponse.json({ token_type: tokens.token_type, card_credential: null });
    setSession(response, tokens);
    return response;
  }

  if (pathname === "auth/logout" && request.method === "POST") {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    const upstream = refreshToken
      ? await fetch(`${RECEPTION_API_URL}/auth/logout`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
          cache: "no-store",
        })
      : null;
    const response = upstream ? await copyResponse(upstream) : new NextResponse(null, { status: 204 });
    clearSession(response);
    return response;
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  let upstream = await upstreamRequest(request, path, accessToken, requestBody);
  if (upstream.status !== 401 || !request.cookies.get(REFRESH_COOKIE)?.value) {
    return copyResponse(upstream);
  }

  const tokens = await refreshTokens(request, request.cookies.get(REFRESH_COOKIE)!.value);
  if (!tokens) {
    const response = await copyResponse(upstream);
    clearSession(response);
    return response;
  }

  upstream = await upstreamRequest(request, path, tokens.access_token, requestBody);
  const response = await copyResponse(upstream);
  setSession(response, tokens);
  return response;
}

async function gateway(request: NextRequest, context: GatewayContext) {
  try {
    return await handle(request, context);
  } catch {
    return NextResponse.json(
      { detail: "No fue posible comunicarse con el servicio de recepción." },
      { status: 502 },
    );
  }
}

export const GET = gateway;
export const POST = gateway;
export const PUT = gateway;
export const PATCH = gateway;
export const DELETE = gateway;
