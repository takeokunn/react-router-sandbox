import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as data from "../../data";
import type { ContactRecord } from "../../data";
import type { Route } from "./+types";
import { loader } from "./loader";

describe("EditContact ローダー", () => {
  let getContactSpy: MockInstance;

  beforeEach(() => {
    getContactSpy = vi.spyOn(data, "getContact");
  });

  afterEach(() => {
    getContactSpy.mockRestore();
  });

  it("getContact が連絡先を見つけた場合、連絡先データを返すこと", async () => {
    const mockContactData: ContactRecord = {
      id: "123",
      first: "John",
      last: "Doe",
      avatar: "https://example.com/avatar.jpg",
      twitter: "@johndoe",
      notes: "Some notes here",
      favorite: true,
      createdAt: new Date().toISOString(),
    };
    getContactSpy.mockResolvedValue(mockContactData);

    const mockParams = { contactId: "123" };
    const request = new Request("http://localhost/contacts/123/edit");
    const context = {};

    const result = await loader({
      params: mockParams,
      request,
      context,
    } as Route.LoaderArgs);

    expect(getContactSpy).toHaveBeenCalledWith("123");
    expect(result).toEqual({ contact: mockContactData });
  });

  it("getContact が連絡先を見つけられない場合、404レスポンスをスローすること", async () => {
    getContactSpy.mockResolvedValue(null);

    const mockParams = { contactId: "404" };
    const request = new Request("http://localhost/contacts/404/edit");
    const context = {};

    try {
      await loader({
        params: mockParams,
        request,
        context,
      } as Route.LoaderArgs);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      const response = error as Response;
      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Not Found");
      expect(getContactSpy).toHaveBeenCalledWith("404");
    }
  });
});
