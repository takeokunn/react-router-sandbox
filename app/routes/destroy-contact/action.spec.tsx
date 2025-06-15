import * as router from "react-router";
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as data from "../../data";
import type { Route } from "./+types";
import { action } from "./action";

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    redirect: vi.fn(() => ({ type: "redirect", to: "/" })),
  };
});

describe("DestroyContact アクション", () => {
  let deleteContactSpy: MockInstance;

  beforeEach(() => {
    deleteContactSpy = vi.spyOn(data, "deleteContact");
  });

  afterEach(() => {
    deleteContactSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("正しい contactId で deleteContact を呼び出し、'/' にリダイレクトすること", async () => {
    const mockContactId = "test-contact-id";
    const mockParams = { contactId: mockContactId };

    const result = await action({ params: mockParams } as Route.ActionArgs);

    expect(deleteContactSpy).toHaveBeenCalledTimes(1);
    expect(deleteContactSpy).toHaveBeenCalledWith(mockContactId);

    expect(router.redirect).toHaveBeenCalledTimes(1);
    expect(router.redirect).toHaveBeenCalledWith("/");

    expect(result).toEqual({ type: "redirect", to: "/" });
  });
});
