"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types/api";
import { useAuth } from "@/components/providers/auth-provider";

interface Options {
  redirectTo?: string;
  roles?: Role[];
  forbiddenRedirectTo?: string;
}

export function useRequireAuth(options: Options = {}) {
  const { redirectTo = "/login", roles, forbiddenRedirectTo } = options;
  const { user, status, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace(redirectTo);
      return;
    }

    if (roles && roles.length > 0 && !hasRole(...roles)) {
      router.replace(forbiddenRedirectTo ?? redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user, router]);

  const ready = status === "authenticated" && (!roles || hasRole(...roles));

  return { user, status, ready };
}
