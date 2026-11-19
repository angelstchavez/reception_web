import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, ApiError } from "@/lib/api-client";

async function expectRejection<T = ApiError>(
  promise: Promise<unknown>,
): Promise<T> {
  try {
    await promise;
    throw new Error("Se esperaba un rechazo, pero la promesa resolvió");
  } catch (e) {
    return e as T;
  }
}

describe("apiClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("GET llama al gateway con método GET, credentials include y devuelve JSON parseado", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      statusText: "OK",
      text: async () => JSON.stringify({ id: "1", role: "admin" }),
    });

    // Act
    const result = await apiClient.get<{ id: string; role: string }>("auth/me");

    // Assert
    expect(result).toEqual({ id: "1", role: "admin" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/reception/auth/me");
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("include");
  });

  it("POST envía JSON con content-type application/json (create user)", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      statusText: "OK",
      text: async () => JSON.stringify({ id: "u1" }),
    });

    // Act
    await apiClient.post("users", {
      json: { email: "a@b.com", role: "admin" },
    });

    // Assert
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ email: "a@b.com", role: "admin" }));
    expect((init.headers as Headers).get("content-type")).toBe(
      "application/json",
    );
  });

  it("POST con form envía url-encoded (login)", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      statusText: "OK",
      text: async () =>
        JSON.stringify({ token_type: "bearer", card_credential: "CARD-1" }),
    });

    // Act
    await apiClient.post("auth/login", {
      form: { username: "a@b.com", password: "secret" },
    });

    // Assert
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Headers).get("content-type")).toBe(
      "application/x-www-form-urlencoded",
    );
    expect(init.body).toBe("username=a%40b.com&password=secret");
  });

  it("query string omite undefined y codifica el resto", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      statusText: "OK",
      text: async () => "[]",
    });

    // Act
    await apiClient.get("users", {
      params: { role: "admin", search: "juan perez", limit: undefined },
    });

    // Assert
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/reception/users?role=admin&search=juan+perez");
  });

  it("respuesta 204 devuelve undefined sin intentar parsear JSON", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 204,
      ok: true,
      statusText: "No Content",
      text: async () => "",
    });

    // Act
    const result = await apiClient.delete<void>("users/u1");

    // Assert
    expect(result).toBeUndefined();
  });

  it("lanza ApiError con status y detail cuando la respuesta no es 2xx", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 401,
      ok: false,
      statusText: "Unauthorized",
      text: async () => JSON.stringify({ detail: "Credenciales inválidas" }),
    });

    // Act
    const promise = apiClient.get("auth/me");

    // Assert
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 401,
      message: "Credenciales inválidas",
    });
  });

  it("convierte arrays de validación en mensaje concatenado (lo usa login-form)", async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      status: 422,
      ok: false,
      statusText: "Unprocessable Entity",
      text: async () =>
        JSON.stringify({
          detail: [
            {
              loc: ["body", "email"],
              msg: "invalid email",
              type: "value_error",
            },
            {
              loc: ["body", "password"],
              msg: "too short",
              type: "value_error",
            },
          ],
        }),
    });

    // Act
    const promise = apiClient.post("users", { json: {} });

    // Assert
    await expect(promise).rejects.toMatchObject({
      status: 422,
      message: "invalid email; too short",
    });
  });

  it("ApiError.validationErrors expone el array; null si el detail no es array", async () => {
    // Arrange (detail array)
    fetchMock.mockResolvedValueOnce({
      status: 422,
      ok: false,
      statusText: "Unprocessable Entity",
      text: async () =>
        JSON.stringify({
          detail: [{ loc: ["body"], msg: "x", type: "y" }],
        }),
    });

    // Act
    const err1 = await expectRejection(apiClient.post("users", { json: {} }));

    // Assert
    expect(err1).toBeInstanceOf(ApiError);
    expect(err1.validationErrors).toEqual([
      { loc: ["body"], msg: "x", type: "y" },
    ]);

    // Arrange (detail string)
    fetchMock.mockResolvedValueOnce({
      status: 400,
      ok: false,
      statusText: "Bad Request",
      text: async () => JSON.stringify({ detail: "mensaje simple" }),
    });

    // Act
    const err2 = await expectRejection(apiClient.get("users"));

    // Assert
    expect(err2.validationErrors).toBeNull();
  });
});
