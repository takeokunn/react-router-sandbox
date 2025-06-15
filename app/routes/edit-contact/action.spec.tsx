import { redirect as mockRedirect } from "react-router";
import { type MockInstance, beforeEach, describe, expect, it, vi } from "vitest";
import * as dataFunctions from "../../data";
import { action } from "./action";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

vi.mock("../../data", async () => {
  const actual = await vi.importActual("../../data");
  return {
    ...actual,
    updateContact: vi.fn(),
  };
});

describe("編集コンタクトアクション (app/routes/edit-contact/action.tsx)", () => {
  let updateContactSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    updateContactSpy = vi.spyOn(dataFunctions, "updateContact");
  });

  const mockContactId = "contact-abc-123";
  const mockFormData = new FormData();
  mockFormData.append("first", "Taro");
  mockFormData.append("last", "Yamada");

  const mockRequest = {
    formData: async () => mockFormData,
  } as unknown as Request;

  it("正常な場合: updateContactを呼び出し、コンタクト詳細ページにリダイレクトすること", async () => {
    const params = { contactId: mockContactId };

    await action({ params, request: mockRequest, context: {} });

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, {
      first: "Taro",
      last: "Yamada",
    });

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}`);
  });

  it("updateContactがエラーをスローした場合: エラーが伝播し、リダイレクトしないこと", async () => {
    const params = { contactId: mockContactId };
    const errorMessage = "Failed to update contact";
    updateContactSpy.mockRejectedValue(new Error(errorMessage));

    await expect(action({ params, request: mockRequest, context: {} })).rejects.toThrow(errorMessage);

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, {
      first: "Taro",
      last: "Yamada",
    });

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("フォームデータが空の場合でも、updateContactが空のオブジェクトで呼び出されること", async () => {
    const params = { contactId: mockContactId };
    const emptyFormData = new FormData();
    const emptyRequest = {
      formData: async () => emptyFormData,
    } as unknown as Request;

    await action({ params, request: emptyRequest, context: {} });

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, {});
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}`);
  });
});
