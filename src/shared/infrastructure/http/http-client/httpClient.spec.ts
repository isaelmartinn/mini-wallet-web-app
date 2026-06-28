import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "./httpClient";
import { HttpError } from "./httpError";

describe("HttpClient", () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
    vi.clearAllMocks();
  });

  describe("Given a successful GET request", () => {
    describe("When calling get method", () => {
      it("Then should return parsed JSON response", async () => {
        const mockData = { id: "1", name: "Test" };

        global.fetch = vi.fn().mockResolvedValue({
          json: async () => mockData,
          ok: true,
          status: 200,
        });

        const result = await httpClient.get<typeof mockData>("/api/test");

        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith(
          "/api/test",
          expect.objectContaining({
            method: "GET",
          })
        );
      });
    });
  });

  describe("Given a successful POST request", () => {
    describe("When calling post method with body", () => {
      it("Then should send JSON body and return response", async () => {
        const requestBody = { name: "Test" };
        const mockResponse = { id: "1", name: "Test" };

        global.fetch = vi.fn().mockResolvedValue({
          json: async () => mockResponse,
          ok: true,
          status: 201,
        });

        const result = await httpClient.post<typeof mockResponse>(
          "/api/test",
          requestBody
        );

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
          "/api/test",
          expect.objectContaining({
            body: JSON.stringify(requestBody),
            method: "POST",
          })
        );
      });
    });
  });

  describe("Given a failed request", () => {
    describe("When server returns 404", () => {
      it("Then should throw HttpError with status 404", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          json: async () => ({ error: "Not found" }),
          ok: false,
          status: 404,
          statusText: "Not Found",
        });

        await expect(httpClient.get("/api/test")).rejects.toThrow(HttpError);
        await expect(httpClient.get("/api/test")).rejects.toMatchObject({
          status: 404,
          statusText: "Not Found",
        });
      });
    });

    describe("When server returns 500", () => {
      it("Then should throw HttpError with status 500", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          json: async () => ({ error: "Internal error" }),
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });

        await expect(httpClient.get("/api/test")).rejects.toThrow(HttpError);
        await expect(httpClient.get("/api/test")).rejects.toMatchObject({
          status: 500,
        });
      });
    });
  });

  describe("Given a DELETE request returning 204", () => {
    describe("When calling delete method", () => {
      it("Then should return undefined", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
        });

        const result = await httpClient.delete("/api/test/1");

        expect(result).toBeUndefined();
      });
    });
  });
});
