import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { loader } from "./loader";
import * as dataFunctions from "../../data";
import type { ContactRecord } from "../../data";
import type { Route } from "./+types";

vi.mock("../../data", async () => {
  const actual = await vi.importActual("../../data");
  return {
    ...actual,
    getContact: vi.fn(),
  };
});

describe("コンタクトローダー (app/routes/contact/loader.tsx)", () => {
  let getContactSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    getContactSpy = vi.spyOn(dataFunctions, "getContact");
  });

  const mockContact: ContactRecord = {
    id: "contact-123",
    first: "Taro",
    last: "Yamada",
    avatar: "http:",
    twitter: "taro_yamada",
    notes: "Test contact",
    favorite: true,
    createdAt: new Date().toISOString(),
  };

  it("contactIdが提供され、getContactがコンタクトを返した場合、そのコンタクトを含むオブジェクトを返すこと", async () => {
    const params = { contactId: "contact-123" };
    getContactSpy.mockResolvedValue(mockContact);

    const result = await loader({ params } as Route.LoaderArgs);

    expect(getContactSpy).toHaveBeenCalledTimes(1);
    expect(getContactSpy).toHaveBeenCalledWith("contact-123");
    expect(result).toEqual({ contact: mockContact });
  });

  it("contactIdが提供され、getContactがnullを返した場合 (コンタクトが見つからない)、contact: nullを含むオブジェクトを返すこと", async () => {
    const params = { contactId: "non-existent-id" };
    getContactSpy.mockResolvedValue(null);

    const result = await loader({ params } as Route.LoaderArgs);

    expect(getContactSpy).toHaveBeenCalledTimes(1);
    expect(getContactSpy).toHaveBeenCalledWith("non-existent-id");
    expect(result).toEqual({ contact: null });
  });

  it("params.contactIdが存在しない場合、getContactがundefinedで呼び出され、結果 (おそらくnull) を返すこと", async () => {
    const params = {};
    getContactSpy.mockResolvedValue(null);

    const result = await loader({ params } as Route.LoaderArgs);

    expect(getContactSpy).toHaveBeenCalledTimes(1);
    expect(getContactSpy).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({ contact: null });
  });

  it("getContactがエラーを投げた場合、エラーが伝播すること", async () => {
    const params = { contactId: "contact-123" };
    const errorMessage = "Failed to fetch contact";
    getContactSpy.mockRejectedValue(new Error(errorMessage));

    await expect(loader({ params } as Route.LoaderArgs)).rejects.toThrow(errorMessage);
    expect(getContactSpy).toHaveBeenCalledTimes(1);
    expect(getContactSpy).toHaveBeenCalledWith("contact-123");
  });
});
