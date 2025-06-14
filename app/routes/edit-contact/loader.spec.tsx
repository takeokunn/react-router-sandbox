import { describe, it, expect, vi } from "vitest";
import { loader } from "./loader";
import { getContact } from "../../data";
import type { ContactRecord } from "../../data";
import type { Route } from "./+types";

vi.mock("../../data", () => ({
  getContact: vi.fn(),
}));

const mockGetContact = getContact as vi.MockedFunction<typeof getContact>;

describe("EditContact ローダー", () => {
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
    mockGetContact.mockResolvedValue(mockContactData);

    const mockParams = { contactId: "123" };
    const request = new Request("http://localhost/contacts/123/edit") as any;
    const context = {} as any;

    const result = await loader({ params: mockParams, request, context } as Route.LoaderArgs);

    expect(mockGetContact).toHaveBeenCalledWith("123");
    expect(result).toEqual({ contact: mockContactData });
  });

  it("getContact が連絡先を見つけられない場合、404レスポンスをスローすること", async () => {
    mockGetContact.mockResolvedValue(null);

    const mockParams = { contactId: "404" };
    const request = new Request("http://localhost/contacts/404/edit") as any;
    const context = {} as any;

    try {
      await loader({ params: mockParams, request, context } as Route.LoaderArgs);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      const response = error as Response;
      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Not Found");
      expect(mockGetContact).toHaveBeenCalledWith("404");
    }
  });
});
