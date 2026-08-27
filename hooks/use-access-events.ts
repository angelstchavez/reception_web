/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { accessEventsService } from "@/lib/services/access-events.service";
import { ApiError } from "@/lib/api-client";
import type {
  AccessEventRead,
  ListAllEventsParams,
  ListEventsParams,
} from "@/types/api";

interface EventsState {
  events: AccessEventRead[];
  loading: boolean;
  error: ApiError | null;
}

const INITIAL_STATE: EventsState = { events: [], loading: true, error: null };

export function useMyAccessEvents(params?: ListEventsParams) {
  const [state, setState] = useState<EventsState>(INITIAL_STATE);

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const events = await accessEventsService.listMine(params);
      setState({ events, loading: false, error: null });
    } catch (err) {
      setState({ events: [], loading: false, error: err as ApiError });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.limit, params?.offset]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}

export function useAllAccessEvents(params?: ListAllEventsParams) {
  const [state, setState] = useState<EventsState>(INITIAL_STATE);

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const events = await accessEventsService.listAll(params);
      setState({ events, loading: false, error: null });
    } catch (err) {
      setState({ events: [], loading: false, error: err as ApiError });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.limit, params?.offset, params?.user_id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
