import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const API_DOMAIN = "https://www.enkai-ai.com";

// package.jsonからname/versionを読み込みUser-Agentを生成する
export function getUserAgent(): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return `${packageJson.name}/${packageJson.version}`;
  } catch (error) {
    // エラー時はフォールバック値を返す
    return "enkai-mcp-server/unknown";
  }
}
