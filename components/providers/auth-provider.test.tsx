import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

const { mockAuthService } = vi.hoisted(() => ({
  mockAuthService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    refresh: vi.fn(),
  },
}));

vi.mock("@/lib/services/auth.service", () => ({
  authService: mockAuthService,
}));

import { AuthProvider, useAuth } from "@/components/providers/auth-provider";

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

const sampleUser = {
  id: "u1",
  email: "admin@u.edu.co",
  full_name: "Admin",
  role: "admin" as const,
  is_active: true,
  access_expires_at: null,
  created_at: "2024-01-01T00:00:00Z",
};

describe("AuthProvider", () => {
  beforeEach(() => {
    mockAuthService.login.mockReset();
    mockAuthService.logout.mockReset();
    mockAuthService.me.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("pasa a 'authenticated' cuando me() responde OK al montar", async () => {
    // Arrange
    mockAuthService.me.mockResolvedValue(sampleUser);

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    expect(result.current.user).toEqual(sampleUser);
  });

  it("pasa a 'unauthenticated' si me() rechaza (token vencido)", async () => {
    // Arrange
    mockAuthService.me.mockRejectedValue(new Error("401"));

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));
    expect(result.current.user).toBeNull();
  });

  it("login guarda card_credential y refresca el usuario", async () => {
    // Arrange
    mockAuthService.me.mockResolvedValue(sampleUser);
    mockAuthService.login.mockResolvedValue({
      token_type: "bearer",
      card_credential: "CARD-42",
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("authenticated"));

    // Act
    await act(async () => {
      await result.current.login("admin@u.edu.co", "secret");
    });

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith(
      "admin@u.edu.co",
      "secret",
    );
    expect(result.current.cardCredential).toBe("CARD-42");
    expect(result.current.user).toEqual(sampleUser);
  });

  it("logout limpia el estado aunque el servidor falle (resiliencia)", async () => {
    // Arrange
    mockAuthService.me.mockResolvedValue(sampleUser);
    mockAuthService.logout.mockRejectedValue(new Error("red caída"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // Act
    await act(async () => {
      await result.current.logout();
    });

    // Assert
    expect(result.current.status).toBe("unauthenticated");
    expect(result.current.user).toBeNull();
    expect(result.current.cardCredential).toBeNull();
  });

  it("hasRole true cuando el rol del usuario está en la lista", async () => {
    // Arrange
    mockAuthService.me.mockResolvedValue(sampleUser);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // Act
    const allowed = result.current.hasRole("admin", "guard");

    // Assert
    expect(allowed).toBe(true);
  });

  it("hasRole false sin usuario (caso límite)", async () => {
    // Arrange
    mockAuthService.me.mockRejectedValue(new Error("401"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));

    // Act
    const allowed = result.current.hasRole("admin");

    // Assert
    expect(allowed).toBe(false);
  });
});

it("register delega en authService.register y devuelve el usuario", async () => {
  // Arrange
  mockAuthService.me.mockRejectedValue(new Error("401"));
  const created = { ...sampleUser, id: "u2", role: "visitor" as const };
  mockAuthService.register.mockResolvedValue(created);
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.status).toBe("unauthenticated"));

  // Act
  const user = await result.current.register({
    email: "nuevo@u.edu.co",
    full_name: "Nuevo",
    password: "secret123",
  });

  // Assert
  expect(user).toEqual(created);
  expect(mockAuthService.register).toHaveBeenCalledWith({
    email: "nuevo@u.edu.co",
    full_name: "Nuevo",
    password: "secret123",
  });
});

import { afterEach } from "vitest";
afterEach(() => {
  vi.restoreAllMocks();
});
