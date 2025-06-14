import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoist mocks to ensure they are applied before module imports
const mockDataLayer = vi.hoisted(() => ({
  getContacts: vi.fn(),
  createEmptyContact: vi.fn(),
  getContact: vi.fn(),
  updateContact: vi.fn(),
  deleteContact: vi.fn(),
}));

vi.mock("./data", () => mockDataLayer);

// Import actions and loaders
// Root
import { action as rootAction } from "./root/action";
import { loader as rootLoader } from "./root/loader";
// Sidebar
import { loader as sidebarLoader } from "./layouts/sidebar/index";
// Contact
import { action as contactAction, loader as contactLoader } from "./routes/contact/index";
// Edit Contact
import { action as editContactAction, loader as editContactLoader } from "./routes/edit-contact/index";
// Destroy Contact
import { action as destroyContactAction } from "./routes/destroy-contact/index";

// Helper to create mock Request objects
const createMockRequest = (urlString: string, method = "GET", formData?: FormData): Request => {
  const url = new URL(urlString, "http://localhost");
  return new Request(url.toString(), {
    method,
    body: formData,
  });
};

describe("ルートハンドラー (ローダーとアクション)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ルート (/) ハンドラー", () => {
    it("rootLoader (GET /) はデータを処理して返す必要があります", async () => {
      const mockContacts = [{ id: "1", first: "Test", last: "User", createdAt: "2023-01-01T00:00:00.000Z" }];
      mockDataLayer.getContacts.mockResolvedValue(mockContacts);

      const request = createMockRequest("/");
      const response = await rootLoader({ request, params: {}, context: {} });

      expect(mockDataLayer.getContacts).toHaveBeenCalled();
      expect(response).toEqual({ contacts: mockContacts });
    });

    it("rootAction (POST /) は処理を行いリダイレクトレスポンスを返す必要があります", async () => {
      const mockContact = { id: "new-id", createdAt: "2023-01-01T00:00:00.000Z" };
      mockDataLayer.createEmptyContact.mockResolvedValue(mockContact);

      const request = createMockRequest("/", "POST");
      const response = await rootAction({ request, params: {}, context: {} });

      expect(mockDataLayer.createEmptyContact).toHaveBeenCalled();
      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302); // Redirect status
        expect(response.headers.get("Location")).toBe(`/contacts/${mockContact.id}/edit`);
      }
    });
  });

  describe("サイドバー (/layouts/sidebar) ハンドラー", () => {
    it("sidebarLoader (GET /?q=test) はデータを処理して返す必要があります", async () => {
      const mockContacts = [{ id: "1", first: "Test", last: "User", createdAt: "2023-01-01T00:00:00.000Z" }];
      mockDataLayer.getContacts.mockResolvedValue(mockContacts);

      const request = createMockRequest("/?q=test");
      const response = await sidebarLoader({ request, params: {}, context: {} });

      expect(mockDataLayer.getContacts).toHaveBeenCalledWith("test");
      expect(response).toEqual({ contacts: mockContacts, q: "test" });
    });
  });

  describe("連絡先表示 (/contacts/:contactId) ハンドラー", () => {
    const contactId = "123";

    it("contactLoader (GET) は連絡先データを返す必要があります (見つからない場合は contact: null)", async () => {
      const mockContact = { id: contactId, first: "Contact", last: "User", createdAt: "2023-01-01T00:00:00.000Z" };
      mockDataLayer.getContact.mockResolvedValue(mockContact);

      const request = createMockRequest(`/contacts/${contactId}`);
      const response = await contactLoader({ request, params: { contactId }, context: {} });

      expect(mockDataLayer.getContact).toHaveBeenCalledWith(contactId);
      expect(response).toEqual({ contact: mockContact });

      // Test case for contact not found (loader should return { contact: null })
      mockDataLayer.getContact.mockResolvedValue(null);
      const requestNotFound = createMockRequest(`/contacts/unknown`);
      const responseNotFound = await contactLoader({ request: requestNotFound, params: { contactId: "unknown" }, context: {} });
      expect(mockDataLayer.getContact).toHaveBeenCalledWith("unknown");
      expect(responseNotFound).toEqual({ contact: null });
    });

    it("contactAction (POST) はお気に入りを更新し、更新された連絡先データを返す必要があります", async () => {
      const formData = new FormData();
      formData.append("favorite", "true");
      const updatedContactMock = { id: contactId, favorite: true, createdAt: "2023-01-01T00:00:00.000Z" };
      mockDataLayer.updateContact.mockResolvedValue(updatedContactMock);


      const request = createMockRequest(`/contacts/${contactId}`, "POST", formData);
      const response = await contactAction({ request, params: { contactId }, context: {} });

      expect(mockDataLayer.updateContact).toHaveBeenCalledWith(contactId, { favorite: true });
      expect(response).toEqual(updatedContactMock);
    });
  });

  describe("連絡先編集 (/contacts/:contactId/edit) ハンドラー", () => {
    const contactId = "123";

    it("editContactLoader (GET) は連絡先データを返すか、見つからない場合は404レスポンスをスローする必要があります", async () => {
      const mockContact = { id: contactId, first: "Contact", last: "User", createdAt: "2023-01-01T00:00:00.000Z" };
      mockDataLayer.getContact.mockResolvedValue(mockContact);

      const request = createMockRequest(`/contacts/${contactId}/edit`);
      const response = await editContactLoader({ request, params: { contactId }, context: {} });

      expect(mockDataLayer.getContact).toHaveBeenCalledWith(contactId);
      expect(response).toEqual({ contact: mockContact });

      // Test 404 when contact not found
      mockDataLayer.getContact.mockResolvedValue(null);
      const requestNotFound = createMockRequest(`/contacts/unknown/edit`);
      try {
        await editContactLoader({ request: requestNotFound, params: { contactId: "unknown" }, context: {} });
        throw new Error("Should have thrown a Response"); // Fail test if no error is thrown
      } catch (e) {
        expect(e).toBeInstanceOf(Response);
        if (e instanceof Response) {
          expect(e.status).toBe(404);
          expect(await e.text()).toBe("Not Found");
        } else {
          throw e; // Re-throw if it's not the expected Response error
        }
      }
    });

    it("editContactAction (POST) は連絡先を更新しリダイレクトレスポンスを返す必要があります", async () => {
      const formData = new FormData();
      formData.append("first", "UpdatedFirst");
      formData.append("last", "UpdatedLast");
      // updateContact's return value is not directly used by this action before redirecting
      mockDataLayer.updateContact.mockResolvedValue({ id: contactId, first: "Old", createdAt: "2023-01-01T00:00:00.000Z" });


      const request = createMockRequest(`/contacts/${contactId}/edit`, "POST", formData);
      const response = await editContactAction({ request, params: { contactId }, context: {} });

      expect(mockDataLayer.updateContact).toHaveBeenCalledWith(contactId, { first: "UpdatedFirst", last: "UpdatedLast" });
      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe(`/contacts/${contactId}`);
      }
    });
  });

  describe("連絡先削除 (/contacts/:contactId/destroy) ハンドラー", () => {
    const contactId = "123";
    it("destroyContactAction (POST) は連絡先を削除しリダイレクトレスポンスを返す必要があります", async () => {
      mockDataLayer.deleteContact.mockResolvedValue(null); // deleteContact returns void/null

      const request = createMockRequest(`/contacts/${contactId}/destroy`, "POST");
      const response = await destroyContactAction({ request, params: { contactId }, context: {} });

      expect(mockDataLayer.deleteContact).toHaveBeenCalledWith(contactId);
      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe("/");
      }
    });
  });
});
