import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from "./index.js";
import { vi } from "vitest";
import * as api from "./api.js";

// APIモジュールをモック
vi.mock("./api.js", () => ({
  createEvent: vi.fn().mockResolvedValue({
    id: "test-event-id",
    token: "dummy-token",
  }),
  generateEventAdminUrl: vi
    .fn()
    .mockReturnValue(
      "https://example.com/auth/event-admin?token=dummy-token&event-id=test-event-id"
    ),
}));

describe("createEventPage", () => {
  it("イベント作成APIを叩き、そのURLを返す", async () => {
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

    // createEventが正しい引数で呼ばれたことを確認
    expect(api.createEvent).toHaveBeenCalledWith(
      "テストイベント",
      "テスト用イベントです",
      [{ startAt: "2023-12-25T15:00:00.000Z", hasTime: true }]
    );

    // generateEventAdminUrlが正しい引数で呼ばれたことを確認
    expect(api.generateEventAdminUrl).toHaveBeenCalledWith(
      "test-event-id",
      "dummy-token"
    );

    // 結果が期待通りであることを確認
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Event management page: https://example.com/auth/event-admin?token=dummy-token&event-id=test-event-id",
        },
      ],
    });
  });
});
