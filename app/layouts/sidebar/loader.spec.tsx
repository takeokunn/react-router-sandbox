import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { loader } from "./loader";
import * as dataFunctions from "../../data";
import type { ContactRecord } from "../../data";

vi.mock("../../data", async () => {
  const actual = await vi.importActual("../../data");
  return {
    ...actual,
    getContacts: vi.fn(),
  };
});

describe("サイドバーローダー (app/layouts/sidebar/loader.tsx)", () => {
  let getContactsSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    getContactsSpy = vi.spyOn(dataFunctions, "getContacts");
  });

  const mockContacts: ContactRecord[] = [
    { id: "1", first: "Taro", last: "Yamada", createdAt: new Date().toISOString() },
    { id: "2", first: "Hanako", last: "Suzuki", createdAt: new Date().toISOString() },
  ];

  const createMockRequest = (url: string): Request => {
    return { url } as Request;
  };

  it("URLに検索クエリqが存在する場合、getContactsをq付きで呼び出し、結果とqを返すこと", async () => {
    const searchQuery = "testquery";
    const request = createMockRequest(`http://localhost/?q=${searchQuery}`);
    getContactsSpy.mockResolvedValue(mockContacts);

    const result = await loader({ request, params: {} });

    expect(getContactsSpy).toHaveBeenCalledTimes(1);
    expect(getContactsSpy).toHaveBeenCalledWith(searchQuery);
    expect(result).toEqual({ contacts: mockContacts, q: searchQuery });
  });

  it("URLに検索クエリqが存在しない場合、getContactsをnullのqで呼び出し、結果とnullのqを返すこと", async () => {
    const request = createMockRequest("http://localhost/");
    getContactsSpy.mockResolvedValue(mockContacts);

    const result = await loader({ request, params: {} });

    expect(getContactsSpy).toHaveBeenCalledTimes(1);
    expect(getContactsSpy).toHaveBeenCalledWith(null);
    expect(result).toEqual({ contacts: mockContacts, q: null });
  });

  it("getContactsが空の配列を返した場合、空のコンタクト配列とqを返すこと", async () => {
    const searchQuery = "empty";
    const request = createMockRequest(`http://localhost/?q=${searchQuery}`);
    const emptyContacts: ContactRecord[] = [];
    getContactsSpy.mockResolvedValue(emptyContacts);

    const result = await loader({ request, params: {} });

    expect(getContactsSpy).toHaveBeenCalledTimes(1);
    expect(getContactsSpy).toHaveBeenCalledWith(searchQuery);
    expect(result).toEqual({ contacts: emptyContacts, q: searchQuery });
  });

  it("getContactsがエラーを投げた場合、エラーが伝播すること", async () => {
    const request = createMockRequest("http://localhost/");
    const errorMessage = "Failed to fetch contacts";
    getContactsSpy.mockRejectedValue(new Error(errorMessage));

    await expect(loader({ request, params: {} })).rejects.toThrow(errorMessage);
    expect(getContactsSpy).toHaveBeenCalledTimes(1);
  });
});
