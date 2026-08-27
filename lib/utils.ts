/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toQueryParams<T extends Record<string, any>>(
  params: T
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}