import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from "./index.js";
import { vi } from "vitest";
import { API_DOMAIN } from "./config.js";

// API_DOMAINをモック
vi.mock("./config.js", () => ({
  API_DOMAIN: "https://example.com",
}));

describe("createEventPage", () => {
  it("イベント作成APIを叩き、そのURLを返す", async () => {
    // axiosをモック
    vi.mock("axios", () => ({
      default: {
        post: vi.fn().mockResolvedValue({
          data: { id: "test-event-id", adminToken: "dummy-token" },
        }),
      },
    }));

    const client = new Client({
      name: "test client",
      version: "0.1.0",
    });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
    const result = await client.callTool({
      name: "createEventPage",
      arguments: {
        title: "テストイベント",
        description: "テスト用イベントです",
        options: [{ startAt: "2023-12-25T15:00:00.000Z", hasTime: true }],
      },
    });

    const params = new URLSearchParams({
      event_id: "test-event-id",
      admin_token: "dummy-token",
      redirect_url: "/events/test-event-id/edit",
    });

    const expectedRedirectUrl = `${API_DOMAIN}/auth/event-admin?${params.toString()}`;

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Event management page: ${encodeURI(expectedRedirectUrl)}`,
        },
      ],
    });
  });
});
