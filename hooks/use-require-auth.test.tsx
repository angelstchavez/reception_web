import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const useAuthMock = vi.fn();
vi.mock("@/components/providers/auth-provider", () => ({
  useAuth: () => useAuthMock(),
}));

import { useRequireAuth } from "@/hooks/use-require-auth";

describe("useRequireAuth", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useAuthMock.mockReset();
  });

  it("no redirige mientras status === 'loading' (evita flash de login)", () => {
    // Arrange
    useAuthMock.mockReturnValue({
      user: null,
      status: "loading",
      hasRole: () => false,
    });

    // Act
    renderHook(() => useRequireAuth());

    // Assert
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirige a /login cuando no está autenticado", () => {
    // Arrange
    useAuthMock.mockReturnValue({
      user: null,
      status: "unauthenticated",
      hasRole: () => false,
    });

    // Act
    renderHook(() => useRequireAuth());

    // Assert
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("respeta redirectTo personalizado", () => {
    // Arrange
    useAuthMock.mockReturnValue({
      user: null,
      status: "unauthenticated",
      hasRole: () => false,
    });

    // Act
    renderHook(() => useRequireAuth({ redirectTo: "/login?from=/users" }));

    // Assert
    expect(replaceMock).toHaveBeenCalledWith("/login?from=/users");
  });

  it("marca ready=true cuando el rol está autorizado", () => {
    // Arrange
    useAuthMock.mockReturnValue({
      user: { id: "u1", role: "admin" },
      status: "authenticated",
      hasRole: (...roles: string[]) => roles.includes("admin"),
    });

    // Act
    const { result } = renderHook(() => useRequireAuth({ roles: ["admin"] }));

    // Assert
    expect(result.current.ready).toBe(true);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirige a forbiddenRedirectTo cuando el rol NO está autorizado (RBAC)", () => {
    // Arrange
    useAuthMock.mockReturnValue({
      user: { id: "u1", role: "student" },
      status: "authenticated",
      hasRole: (...roles: string[]) => roles.includes("student"),
    });

    // Act
    renderHook(() =>
      useRequireAuth({ roles: ["admin"], forbiddenRedirectTo: "/403" }),
    );

    // Assert
    expect(replaceMock).toHaveBeenCalledWith("/403");
  });
});
