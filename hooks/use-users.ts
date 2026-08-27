"use client";

import { useCallback, useState } from "react";
import { usersService } from "@/lib/services/users.service";
import { ApiError } from "@/lib/api-client";
import type { UserCreate, UserRead, VisitorCreate } from "@/types/api";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createUser = useCallback(
    async (payload: UserCreate): Promise<UserRead | null> => {
      setLoading(true);
      setError(null);
      try {
        return await usersService.create(payload);
      } catch (err) {
        setError(err as ApiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createUser, loading, error };
}

export function useCreateVisitor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createVisitor = useCallback(
    async (payload: VisitorCreate): Promise<UserRead | null> => {
      setLoading(true);
      setError(null);
      try {
        return await usersService.createVisitor(payload);
      } catch (err) {
        setError(err as ApiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createVisitor, loading, error };
}
