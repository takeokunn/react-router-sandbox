import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "./loader"; // 対象のloader関数
import * as dataFunctions from "../data"; // getContactsをモックするため
import type { ContactRecord } from "../data"; // 型定義のインポート

// ../dataモジュールのgetContactsをモック
vi.mock("../data", async () => {
  const actual = await vi.importActual("../data");
  return {
    ...actual,
    getContacts: vi.fn(),
  };
});

describe("ルートローダー (app/root/loader.ts)", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.resetAllMocks();
  });

  it("getContactsを呼び出し、返されたコンタクトの配列を含むオブジェクトを返すこと", async () => {
    const mockContacts: ContactRecord[] = [
      { id: "1", first: "Taro", last: "Yamada", createdAt: new Date().toISOString() },
      { id: "2", first: "Hanako", last: "Suzuki", createdAt: new Date().toISOString() },
    ];

    // getContactsがモックされたコンタクト配列を返すように設定
    const getContactsSpy = vi.spyOn(dataFunctions, "getContacts").mockResolvedValue(mockContacts);

    // loaderを実行
    const result = await loader();

    // getContactsが呼び出されたことを確認
    expect(getContactsSpy).toHaveBeenCalledTimes(1);

    // loaderが正しい形式のオブジェクトを返したことを確認
    expect(result).toEqual({ contacts: mockContacts });
  });

  it("getContactsが空の配列を返した場合、空のコンタクト配列を含むオブジェクトを返すこと", async () => {
    const mockContacts: ContactRecord[] = [];
    vi.spyOn(dataFunctions, "getContacts").mockResolvedValue(mockContacts);

    const result = await loader();

    expect(result).toEqual({ contacts: [] });
  });

  it("getContactsがエラーを投げた場合、エラーが伝播すること", async () => {
    const errorMessage = "Failed to fetch contacts";
    vi.spyOn(dataFunctions, "getContacts").mockRejectedValue(new Error(errorMessage));

    // loaderの実行とエラーのキャッチを試みる
    await expect(loader()).rejects.toThrow(errorMessage);
  });
});
