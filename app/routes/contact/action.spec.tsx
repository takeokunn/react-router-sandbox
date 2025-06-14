import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { action } from "./action";
import * as dataFunctions from "../../data";
import type { Route } from "./+types";
import type { ContactRecord } from "../../data";

vi.mock("../../data", async () => {
  const actual = await vi.importActual("../../data");
  return {
    ...actual,
    updateContact: vi.fn(),
  };
});

describe("コンタクトアクション (app/routes/contact/action.tsx)", () => {
  let updateContactSpy: MockInstance

  beforeEach(() => {
    vi.resetAllMocks();
    updateContactSpy = vi.spyOn(dataFunctions, "updateContact");
  });

  const mockContactId = "contact-xyz-789";
  const mockUpdatedContact: ContactRecord = {
    id: mockContactId,
    first: "Updated",
    last: "Contact",
    favorite: true,
    createdAt: new Date().toISOString(),
  };

  const createMockRequest = (favoriteValue: string | null): Request => {
    const formData = new FormData();
    if (favoriteValue !== null) {
      formData.append("favorite", favoriteValue);
    }
    return {
      formData: async () => formData,
    } as unknown as Request;
  };

  it("フォームデータでfavoriteが'true'の場合、updateContactをfavorite: trueで呼び出すこと", async () => {
    const request = createMockRequest("true");
    const params = { contactId: mockContactId };
    updateContactSpy.mockResolvedValue(mockUpdatedContact);

    const result = await action({ params, request } as Route.ActionArgs);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { favorite: true });
    expect(result).toEqual(mockUpdatedContact);
  });

  it("フォームデータでfavoriteが'false'の場合、updateContactをfavorite: falseで呼び出すこと", async () => {
    const request = createMockRequest("false");
    const params = { contactId: mockContactId };
    const updatedContactFalse = { ...mockUpdatedContact, favorite: false };
    updateContactSpy.mockResolvedValue(updatedContactFalse);

    const result = await action({ params, request } as Route.ActionArgs);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { favorite: false });
    expect(result).toEqual(updatedContactFalse);
  });

  it("フォームデータにfavoriteが存在しない場合、updateContactをfavorite: falseで呼び出すこと", async () => {
    const request = createMockRequest(null);
    const params = { contactId: mockContactId };
    const updatedContactNoFavorite = { ...mockUpdatedContact, favorite: false };
    updateContactSpy.mockResolvedValue(updatedContactNoFavorite);

    const result = await action({ params, request } as Route.ActionArgs);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { favorite: false });
    expect(result).toEqual(updatedContactNoFavorite);
  });

  it("params.contactIdが存在しない場合でも、updateContactがundefinedのIDで呼び出されること", async () => {

    const request = createMockRequest("true");
    const params = {};
    updateContactSpy.mockResolvedValue(mockUpdatedContact);

    await action({ params, request } as Route.ActionArgs);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(undefined, { favorite: true });
  });

  it("updateContactがエラーをスローした場合、エラーが伝播すること", async () => {
    const request = createMockRequest("true");
    const params = { contactId: mockContactId };
    const errorMessage = "Failed to update contact favorite status";
    updateContactSpy.mockRejectedValue(new Error(errorMessage));

    await expect(action({ params, request } as Route.ActionArgs)).rejects.toThrow(errorMessage);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { favorite: true });
  });
});
