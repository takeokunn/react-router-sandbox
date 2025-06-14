import { describe, it, expect, vi, beforeEach, afterEach, type SpyInstance } from "vitest";
import { loader } from "./loader";
import * as data from "../../data"; // Import the module for spyOn
import type { ContactRecord } from "../../data";
import type { Route } from "../../+types/root"; // Assuming Route.LoaderArgs is defined here or similar

describe("Sidebar Loader ローダー", () => {
  let getContactsSpy: SpyInstance<[query?: string | null | undefined], Promise<ContactRecord[]>>;

  beforeEach(() => {
    // Create a spy on data.getContacts before each test
    getContactsSpy = vi.spyOn(data, 'getContacts');
  });

  afterEach(() => {
    // Restore the original implementation after each test
    getContactsSpy.mockRestore();
  });

  it("URLにクエリパラメータqが存在する場合、getContactsをq付きで呼び出し、連絡先とqを返すこと", async () => {
    const mockContactsData: ContactRecord[] = [
      { id: "1", first: "Test", last: "User", createdAt: new Date().toISOString() },
    ];
    const searchQuery = "testquery";
    getContactsSpy.mockResolvedValue(mockContactsData);

    const request = new Request(`http://localhost/?q=${searchQuery}`);
    // Cast to any for simplicity, or define a more complete mock LoaderArgs
    const params = {} as any; 
    const context = {} as any;

    const result = await loader({ request, params, context } as Route.LoaderArgs);

    expect(getContactsSpy).toHaveBeenCalledWith(searchQuery);
    expect(result).toEqual({ contacts: mockContactsData, q: searchQuery });
  });

  it("URLにクエリパラメータqが存在しない場合、getContactsをnullで呼び出し、連絡先とnullのqを返すこと", async () => {
    const mockContactsData: ContactRecord[] = [
      { id: "2", first: "Another", last: "User", createdAt: new Date().toISOString() },
    ];
    getContactsSpy.mockResolvedValue(mockContactsData);

    const request = new Request("http://localhost/");
    const params = {} as any;
    const context = {} as any;

    const result = await loader({ request, params, context } as Route.LoaderArgs);

    expect(getContactsSpy).toHaveBeenCalledWith(null); // q will be null if not present
    expect(result).toEqual({ contacts: mockContactsData, q: null });
  });

  it("getContactsが空の配列を返す場合、空の連絡先リストとqを返すこと", async () => {
    const emptyContactsData: ContactRecord[] = [];
    const searchQuery = "empty";
    getContactsSpy.mockResolvedValue(emptyContactsData);
    
    const request = new Request(`http://localhost/?q=${searchQuery}`);
    const params = {} as any;
    const context = {} as any;

    const result = await loader({ request, params, context } as Route.LoaderArgs);

    expect(getContactsSpy).toHaveBeenCalledWith(searchQuery);
    expect(result).toEqual({ contacts: emptyContactsData, q: searchQuery });
  });
});
