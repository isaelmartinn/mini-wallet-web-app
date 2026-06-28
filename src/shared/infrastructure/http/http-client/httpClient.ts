import { HttpClient as HttpClientInterface } from "./httpClient.interface";
import { HttpError } from "./httpError";

export class HttpClient implements HttpClientInterface {
  private readonly timeout: number = 10000;

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: "GET",
    });
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>(url, {
      body: body ? JSON.stringify(body) : undefined,
      method: "POST",
    });
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      body: JSON.stringify(body),
      method: "PUT",
    });
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }

        throw new HttpError(response.status, response.statusText, errorBody);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if ((error as Error).name === "AbortError") {
        throw new HttpError(408, "Request Timeout");
      }

      throw error;
    }
  }
}
