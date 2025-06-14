import { redirect as mockRedirect } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as dataFunctions from "../data";
import { action } from "./action";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

vi.mock("../data", async () => {
  const actual = await vi.importActual("../data");
  return {
    ...actual,
    createEmptyContact: vi.fn(),
  };
});

describe("ルートアクション (app/root/action.ts)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("createEmptyContactを呼び出し、返されたコンタクトIDで編集ページにリダイレクトすること", async () => {
    const mockContactId = "new-contact-123";
    const mockContact = { id: mockContactId };
    const createEmptyContactSpy = vi.spyOn(dataFunctions, "createEmptyContact").mockResolvedValue(mockContact as any);

    await action();

    expect(createEmptyContactSpy).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(`/contacts/${mockContactId}/edit`);
  });

  it("createEmptyContactがエラーを投げた場合、エラーが伝播すること", async () => {
    const errorMessage = "Failed to create contact";
    vi.spyOn(dataFunctions, "createEmptyContact").mockRejectedValue(new Error(errorMessage));

    await expect(action()).rejects.toThrow(errorMessage);

    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
