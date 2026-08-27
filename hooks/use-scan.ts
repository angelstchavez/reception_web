"use client";

import { useCallback, useState } from "react";
import { accessEventsService } from "@/lib/services/access-events.service";
import { ApiError } from "@/lib/api-client";
import type { ScanResponse } from "@/types/api";

export function useScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastResult, setLastResult] = useState<ScanResponse | null>(null);

  const scan = useCallback(
    async (credential: string): Promise<ScanResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await accessEventsService.scan({ credential });
        setLastResult(result);
        return result;
      } catch (err) {
        setError(err as ApiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { scan, loading, error, lastResult };
}
