import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replaceMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

const loginMock = vi.fn();
vi.mock("@/components/providers/auth-provider", () => ({
  useAuth: () => ({ login: loginMock }),
}));

import { LoginForm } from "@/components/public/auth/login/login-form";
import { ApiError } from "@/lib/api-client";

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    "admin@u.edu.co",
  );
  await user.type(screen.getByLabelText(/^Contraseña$/i), "secret");
  await user.click(screen.getByRole("button", { name: /^Iniciar sesión$/i }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    refreshMock.mockReset();
    loginMock.mockReset();
  });

  it("envía email/contraseña y navega a /dashboard en éxito", async () => {
    // Arrange
    const user = userEvent.setup();
    loginMock.mockResolvedValue(undefined);
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith("admin@u.edu.co", "secret"),
    );
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("muestra mensaje específico para 401", async () => {
    // Arrange
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new ApiError(401, "Unauthorized"));
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Correo o contraseña incorrectos.",
    );
  });

  it("muestra mensaje específico para 429 (rate limit)", async () => {
    // Arrange
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new ApiError(429, "Too Many Requests"));
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /demasiados intentos/i,
    );
  });

  it("muestra mensaje de red para errores no-ApiError", async () => {
    // Arrange
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new Error("Network Error"));
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /revisa tu conexión/i,
    );
  });

  it("deshabilita el botón mientras la promesa está pendiente (loading)", async () => {
    // Arrange
    const user = userEvent.setup();
    let resolveLogin!: () => void;
    loginMock.mockImplementation(
      () => new Promise<void>((r) => (resolveLogin = r)),
    );
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    const pendingButton = await screen.findByRole("button", {
      name: /iniciando sesión/i,
    });
    expect(pendingButton).toBeDisabled();

    await act(async () => {
      resolveLogin();
    });
  });

  it("usa el mensaje del ApiError cuando el status no es 401 ni 429", async () => {
    // Arrange
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new ApiError(500, "Servicio caído"));
    render(<LoginForm />);

    // Act
    await fillAndSubmit(user);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Servicio caído",
    );
  });
});
