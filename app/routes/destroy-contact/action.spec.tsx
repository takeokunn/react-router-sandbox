import { describe, it, expect, vi, beforeEach, afterEach, type SpyInstance } from "vitest";
import { action } from "./action";
import * as data from "../../data";
import * as router from "react-router"; // Import the module for spyOn
import type { Route } from "./+types"; // Assuming +types.ts defines Route.ActionArgs

describe("DestroyContact Action", () => {
  let deleteContactSpy: SpyInstance;
  let redirectSpy: SpyInstance;

  beforeEach(() => {
    // Spy on data.deleteContact
    deleteContactSpy = vi.spyOn(data, 'deleteContact').mockResolvedValue(null); // Mock implementation

    // Spy on router.redirect
    // Mock redirect to return a specific object for assertion
    const mockRedirectResponse = { type: "redirect", to: "/" } as any; 
    redirectSpy = vi.spyOn(router, 'redirect').mockReturnValue(mockRedirectResponse);
  });

  afterEach(() => {
    // Restore the original implementations
    deleteContactSpy.mockRestore();
    redirectSpy.mockRestore();
  });

  it("should call deleteContact with the correct contactId and redirect to '/'", async () => {
    const mockContactId = "test-contact-id";
    const mockParams = { contactId: mockContactId };
    
    // Mock ActionArgs - request and context can be minimal if not used directly by the action
    const request = new Request("http://localhost/contacts/test-contact-id/destroy", { method: "POST" }) as any;
    const context = {} as any;

    const result = await action({ params: mockParams, request, context } as Route.ActionArgs);

    // Verify deleteContact was called
    expect(deleteContactSpy).toHaveBeenCalledTimes(1);
    expect(deleteContactSpy).toHaveBeenCalledWith(mockContactId);

    // Verify redirect was called
    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith("/");

    // Verify the action returns the result of the redirect
    expect(result).toEqual({ type: "redirect", to: "/" });
  });

  it("should throw an error if contactId is missing (though type system should prevent this)", async () => {
    // This test checks robustness, though TypeScript should catch missing params.
    const mockParams = {}; // Missing contactId
    const request = new Request("http://localhost/contacts/destroy", { method: "POST" }) as any;
    const context = {} as any;
    
    // deleteContact in the actual implementation might throw if contactId is undefined.
    // We'll mock it to simulate that or just check if it's called with undefined.
    deleteContactSpy.mockImplementation(async (id) => {
      if (typeof id === 'undefined') {
        throw new Error("contactId is undefined");
      }
      return null;
    });

    await expect(
      action({ params: mockParams, request, context } as Route.ActionArgs)
    ).rejects.toThrow("contactId is undefined");
    
    expect(deleteContactSpy).toHaveBeenCalledWith(undefined);
    expect(redirectSpy).not.toHaveBeenCalled();
  });
});
