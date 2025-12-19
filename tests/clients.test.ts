import { describe, it, expect } from "vitest";
import { createOrUpdateClient } from "@/lib/clients";
import {
  createMockTransaction,
  asTrx,
  expectPartial,
} from "./utils/test-utils";

describe("createOrUpdateClient", () => {
  it("should create a new client when email does not exist", async () => {
    const mockTrx = createMockTransaction();

    const mockClient = {
      id: "client-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "0612345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTrx.limit.mockResolvedValue([]);
    mockTrx.returning.mockResolvedValue([mockClient]);

    const result = await createOrUpdateClient(asTrx(mockTrx), {
      name: "John Doe",
      email: "john@example.com",
      phone: "0612345678",
    });

    expect(result.isNew).toBe(true);
    expect(result.client).toEqual(mockClient);
    expect(mockTrx.insert).toHaveBeenCalled();
    expect(mockTrx.values).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      phone: "0612345678",
    });
  });

  it("should update existing client when email already exists", async () => {
    const mockTrx = createMockTransaction();

    const existingClient = {
      id: "client-456",
      name: "Jane Doe",
      email: "john@example.com",
      phone: "0698765432",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedClient = {
      ...existingClient,
      name: "John Doe Updated",
      phone: "0612345678",
      updatedAt: new Date(),
    };

    mockTrx.limit.mockResolvedValue([existingClient]);
    mockTrx.returning.mockResolvedValue([updatedClient]);

    const result = await createOrUpdateClient(asTrx(mockTrx), {
      name: "John Doe Updated",
      email: "john@example.com",
      phone: "0612345678",
    });

    expect(result.isNew).toBe(false);
    expect(result.client).toEqual(updatedClient);
    expect(mockTrx.update).toHaveBeenCalled();
    expect(mockTrx.set).toHaveBeenCalledWith(
      expectPartial({
        name: "John Doe Updated",
        phone: "0612345678",
      })
    );
  });

  it("should create client with null phone when not provided", async () => {
    const mockTrx = createMockTransaction();

    const mockClient = {
      id: "client-789",
      name: "Alice Smith",
      email: "alice@example.com",
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTrx.limit.mockResolvedValue([]);
    mockTrx.returning.mockResolvedValue([mockClient]);

    const result = await createOrUpdateClient(asTrx(mockTrx), {
      name: "Alice Smith",
      email: "alice@example.com",
    });

    expect(result.isNew).toBe(true);
    expect(result.client.phone).toBeNull();
    expect(mockTrx.values).toHaveBeenCalledWith({
      name: "Alice Smith",
      email: "alice@example.com",
      phone: null,
    });
  });

  it("should keep existing phone when updating without new phone", async () => {
    const mockTrx = createMockTransaction();

    const existingClient = {
      id: "client-999",
      name: "Bob Martin",
      email: "bob@example.com",
      phone: "0611111111",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedClient = {
      ...existingClient,
      name: "Robert Martin",
      updatedAt: new Date(),
    };

    mockTrx.limit.mockResolvedValue([existingClient]);
    mockTrx.returning.mockResolvedValue([updatedClient]);

    await createOrUpdateClient(asTrx(mockTrx), {
      name: "Robert Martin",
      email: "bob@example.com",
    });

    expect(mockTrx.set).toHaveBeenCalledWith(
      expectPartial({
        name: "Robert Martin",
        phone: "0611111111",
      })
    );
  });
});
