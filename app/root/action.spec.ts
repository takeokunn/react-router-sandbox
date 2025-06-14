import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "./action"; // 対象のaction関数
import * as dataFunctions from "../data"; // createEmptyContactをモックするため
import { redirect as mockRedirect } from "react-router";

// react-routerのredirectをモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

// ../dataモジュールのcreateEmptyContactをモック
vi.mock("../data", async () => {
  const actual = await vi.importActual("../data");
  return {
    ...actual,
    createEmptyContact: vi.fn(),
  };
});

describe("ルートアクション (app/root/action.ts)", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.resetAllMocks();
  });

  it("createEmptyContactを呼び出し、返されたコンタクトIDで編集ページにリダイレクトすること", async () => {
    const mockContactId = "new-contact-123";
    const mockContact = { id: mockContactId, /* other properties */ };

    // createEmptyContactがモックされたコンタクトを返すように設定
    const createEmptyContactSpy = vi.spyOn(dataFunctions, "createEmptyContact").mockResolvedValue(mockContact as any);

    // actionを実行
    await action();

    // createEmptyContactが呼び出されたことを確認
    expect(createEmptyContactSpy).toHaveBeenCalledTimes(1);

    // redirectが正しいパスで呼び出されたことを確認
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}/edit`);
  });

  it("createEmptyContactがエラーを投げた場合、エラーが伝播すること", async () => {
    const errorMessage = "Failed to create contact";
    vi.spyOn(dataFunctions, "createEmptyContact").mockRejectedValue(new Error(errorMessage));

    // actionの実行とエラーのキャッチを試みる
    await expect(action()).rejects.toThrow(errorMessage);

    // redirectが呼び出されないことを確認
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
