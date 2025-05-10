# enkai-mcp-server

An MCP server for seamless event scheduling on [EnkAI](https://www.enkai-ai.com/).

| 1. Your Prompt                                     | 2. Generated Schedule Page                                |
| -------------------------------------------------- | --------------------------------------------------------- |
| ![Example of a user prompt in chat](meta/chat.png) | ![Example of the generated scheduling page](meta/web.png) |

## Get Started

To use this MCP server in your project, install it via npm:

```bash
npm install enkai-mcp
npm build
```

## Usage

When you input potential dates for an event from the MCP Client, a page is generated where attendance can be confirmed. For example, if you say, "I want to schedule a social gathering between 2025/10/01 and 2025/10/05," the LLM will find and execute the tool on this MCP Server. The tool also includes responses with execution dates and calendars, allowing you to specify relative dates like "tomorrow" or "this week," as well as days of the week like "weekdays" or "weekends" as potential dates.

Integrating with a calendar MCP could enable advanced applications such as narrowing down candidate dates based on participants' availability or adjusting schedules to account for local holidays.

## Installation in your client

To use this MCP server, you'll need to configure your MCP client software.

```json
{
  "mcpServers": {
    "enkai-mcp-server": {
      "command": "npx",
      "args": [
        "enkai-mcp"
        // You can also specify a version, e.g., "enkai-mcp@1.0.0"
      ]
    }
    // ... other MCP server configurations
  }
}
```

If you are using Raycast, you can install it using a deeplink created by percent-encoding JSON like the one above.

```
raycast://mcp/install?%7B%22name%22%3A%22enkai-mcp-server%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22enkai-mcp%40latest%22%5D%7D
```
