import axios from "axios";
import { API_DOMAIN, getUserAgent } from "./config.js";

/**
 * イベントを作成するAPIを呼び出す
 * @param title イベントタイトル
 * @param description イベントの説明
 * @param options 候補日時のオプション
 * @returns APIレスポンス
 */
export async function createEvent(
  title: string,
  description: string,
  options: Array<{ startAt: string; hasTime: boolean }>
) {
  const res = await axios.post(
    `${API_DOMAIN}/api/public/v1/events`,
    { title, description, options },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
    }
  );

  return res.data;
}

/**
 * イベント管理ページのURLを生成する
 * @param eventId イベントID
 * @param token 認証トークン
 * @returns イベント管理ページのURL
 */
export function generateEventAdminUrl(eventId: string, token: string): string {
  const params = new URLSearchParams({
    token: token,
    "event-id": eventId,
  });
  return `${API_DOMAIN}/auth/event-admin?${params.toString()}`;
}
