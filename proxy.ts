import { NextRequest, NextResponse } from "next/server";
import type { UserRead } from "@/types/api";
import { ROUTE_ACCESS, RoleType, homeForRole } from "./lib/roles";

const PROTECTED_PREFIXES = Object.keys(ROUTE_ACCESS);

const ACCESS_COOKIE = "rap_access_token";
const REFRESH_COOKIE = "rap_refresh_token";

function matchProtectedPrefix(pathname: string): string | undefined {
  return PROTECTED_PREFIXES.find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

interface Session {
  user: UserRead;
  setCookieHeaders: string[];
}

async function fetchSession(request: NextRequest): Promise<Session | null> {
  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const res = await fetch(meUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    if (!res.ok) return null;

    const setCookieHeaders =
      typeof res.headers.getSetCookie === "function"
        ? res.headers.getSetCookie()
        : [res.headers.get("set-cookie") ?? ""].filter(Boolean);

    const user = (await res.json()) as UserRead;
    return { user, setCookieHeaders };
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = matchProtectedPrefix(pathname);

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const hasAnySessionCookie =
    Boolean(request.cookies.get(ACCESS_COOKIE)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (!hasAnySessionCookie) {
    return redirectToLogin(request);
  }

  const session = await fetchSession(request);

  if (!session) {
    const response = redirectToLogin(request);
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const { user, setCookieHeaders } = session;
  const role = user.role as RoleType;
  const allowedRoles = ROUTE_ACCESS[matchedPrefix] ?? [];

  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL(homeForRole(role), request.url));
  }

  const response = NextResponse.next();

  for (const cookie of setCookieHeaders) {
    if (cookie) response.headers.append("Set-Cookie", cookie);
  }

  response.headers.set("x-user-id", user.id);
  response.headers.set("x-user-role", role);

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scan/:path*",
    "/events/:path*",
    "/visitors/:path*",
    "/users/:path*",
  ],
};
