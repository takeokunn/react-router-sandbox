import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { action } from "./action";
import * as data from "../../data";
import type { Route } from "./+types";
import * as router from "react-router";

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

    // Verify deleteContact was called
    expect(deleteContactSpy).toHaveBeenCalledTimes(1);
    expect(deleteContactSpy).toHaveBeenCalledWith(mockContactId);

    // Verify redirect was called
    expect(router.redirect).toHaveBeenCalledTimes(1);
    expect(router.redirect).toHaveBeenCalledWith("/");

    // Verify the action returns the result of the redirect
    expect(result).toEqual({ type: "redirect", to: "/" });
  });
});
