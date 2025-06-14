import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "./action"; // 対象のaction関数
import * as dataFunctions from "../../data"; // updateContactをモックするため
import { redirect as mockRedirect } from "react-router";
import invariant from "tiny-invariant"; // invariantの動作をテストするため

// react-routerのredirectをモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

// ../../dataモジュールのupdateContactをモック
vi.mock("../../data", async () => {
  const actual = await vi.importActual("../../data");
  return {
    ...actual,
    updateContact: vi.fn(),
  };
});

// tiny-invariantをモック (エラーメッセージを確認するため)
vi.mock("tiny-invariant");

describe("編集コンタクトアクション (app/routes/edit-contact/action.tsx)", () => {
  let updateContactSpy: vi.SpyInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    // updateContactのspyをセットアップ
    updateContactSpy = vi.spyOn(dataFunctions, "updateContact").mockResolvedValue(undefined);
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

    await action({ params, request: mockRequest });

    // updateContactが正しい引数で呼び出されたことを確認
    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { first: "Taro", last: "Yamada" });

    // redirectが正しいパスで呼び出されたことを確認
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}`);
  });

  it("params.contactIdが存在しない場合: invariantがエラーをスローし、リダイレクトしないこと", async () => {
    const params = {}; // contactIdなし
    (invariant as vi.Mock).mockImplementation((condition, message) => {
      if (!condition) {
        throw new Error(message);
      }
    });

    await expect(action({ params, request: mockRequest })).rejects.toThrow("Missing contactId param");

    // updateContactとredirectが呼び出されないことを確認
    expect(updateContactSpy).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("updateContactがエラーをスローした場合: エラーが伝播し、リダイレクトしないこと", async () => {
    const params = { contactId: mockContactId };
    const errorMessage = "Failed to update contact";
    updateContactSpy.mockRejectedValue(new Error(errorMessage));

    await expect(action({ params, request: mockRequest })).rejects.toThrow(errorMessage);

    // updateContactが呼び出されたことを確認 (エラーをスローする前に)
    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, { first: "Taro", last: "Yamada" });

    // redirectが呼び出されないことを確認
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("フォームデータが空の場合でも、updateContactが空のオブジェクトで呼び出されること", async () => {
    const params = { contactId: mockContactId };
    const emptyFormData = new FormData();
    const emptyRequest = {
      formData: async () => emptyFormData,
    } as unknown as Request;

    await action({ params, request: emptyRequest });

    expect(updateContactSpy).toHaveBeenCalledTimes(1);
    expect(updateContactSpy).toHaveBeenCalledWith(mockContactId, {});
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}`);
  });
});
