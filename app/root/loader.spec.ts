import { beforeEach, describe, expect, it, vi } from "vitest";
import * as dataFunctions from "../data";
import type { ContactRecord } from "../data";
import { loader } from "./loader";

vi.mock("../data", async () => {
  const actual = await vi.importActual("../data");
  return {
    ...actual,
    getContacts: vi.fn(),
  };
});

describe("ルートローダー (app/root/loader.ts)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getContactsを呼び出し、返されたコンタクトの配列を含むオブジェクトを返すこと", async () => {
    const mockContacts: ContactRecord[] = [
      {
        id: "1",
        first: "Taro",
        last: "Yamada",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        first: "Hanako",
        last: "Suzuki",
        createdAt: new Date().toISOString(),
      },
    ];
    const getContactsSpy = vi.spyOn(dataFunctions, "getContacts").mockResolvedValue(mockContacts);

    const result = await loader();

    expect(getContactsSpy).toHaveBeenCalledTimes(1);
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

    await expect(loader()).rejects.toThrow(errorMessage);
  });
});
