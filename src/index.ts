import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";

export const server = new McpServer({
  name: "EnkAI",
  version: "0.1.0",
});

import { z } from "zod";
import { API_DOMAIN } from "./config.js";
import { getMonthDateToDayNameMap, getCurrentDate } from "./date-helpers.js";

server.tool(
  "createEventPage",
  "Create an event and return the URL (admin page) for the event page. This page can be used to coordinate schedules and confirm attendance for events such as drinking parties, company events, outdoor activities, and trips. The generated URL has an expiration date, so please encourage the user to open and verify it promptly. After opening, the user should share it with others. When the URL is opened, there is a sharing feature that prompts participants to fill in their attendance.",
  {
    title: z.string().min(1).max(50).describe("Event title"),
    description: z.string().max(1000).describe("Event description"),
    options: z
      .array(
        z.object({
          startAt: z
            .string()
            .describe(
              "ISO8601 format date and time (e.g., 2025-05-11T10:00:00+09:00, 2023-12-15T19:00:00Z)"
            ),
          hasTime: z
            .boolean()
            .describe("Time specified (true) or not specified (false)"),
        })
      )
      .min(1)
      .describe("Schedule options (at least one is required)"),
  },
  async ({ title, description, options }) => {
    try {
      try {
        const res = await axios.post(
          `${API_DOMAIN}/api/public/v1/events`,
          { title, description, options },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = res.data;
        const params = new URLSearchParams({ token: data.token });
        const redirectUrl = `${API_DOMAIN}/auth/event-admin?${params.toString()}`;
        return {
          content: [
            {
              type: "text",
              text: `Event management page: ${encodeURI(redirectUrl)}`,
            },
          ],
        };
      } catch (error: any) {
        if (error.response) {
          return {
            content: [
              {
                type: "text",
                text: `Failed to create event (status: ${error.response.status})`,
              },
            ],
            isError: true,
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Request failed: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Request failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "getCalendarInfoForMonth",
  "Returns a map of dates to their English day names for a given month and year. Useful for event scheduling.",
  {
    month: z
      .number()
      .int()
      .min(1)
      .max(12)
      .optional()
      .describe(
        "The month number (1-12). Defaults to the current month if not provided."
      ),
    year: z
      .number()
      .int()
      .optional()
      .describe("The year. Defaults to the current year if not provided."),
  },
  async ({ month, year }) => {
    try {
      const calendarData = getMonthDateToDayNameMap(month, year);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(calendarData, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to get calendar info: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "getCurrentISODate",
  "Returns the current date in ISO8601 format. Useful for event scheduling.",
  {},
  async () => {
    try {
      const currentDate = getCurrentDate();
      return {
        content: [
          {
            type: "text",
            text: currentDate,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to get current date: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.prompt(
  "createEventPage",
  {
    optionsDescription: z
      .string()
      .describe(
        "Description of the candidate options (e.g., next week, holidays this month, 2025/05/05-2025/05/11, 2025/05/11 15:00)"
      ),
    title: z.string().optional().describe("Event title"),
    description: z.string().optional().describe("Event description"),
  },
  ({ optionsDescription, title, description }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `
          Based on the user's input, please use the createEventPage tool to create an event. 
          If there is any missing information in the user's input, please suggest the necessary information.
          the user specifies a relative date such as 'tomorrow' or 'next month', or specifies days like 'weekdays' or 'holidays', please use another tool to estimate candidate dates.
          You should respond to the user with the information about the event plus the URL obtained with createEventPage.

          ---
          user's input
          - title: ${title ? `"${title}"` : "none"}
          - description: ${description ? `"${description}"` : "none"}
          - optionsDescription: ${
            optionsDescription ? `"${optionsDescription}"` : "none"
          }
          `,
        },
      },
    ],
  })
);

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const transport = new StdioServerTransport();
await server.connect(transport);
