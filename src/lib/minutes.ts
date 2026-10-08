import { getCollection, type CollectionEntry } from "astro:content";
import { REPO_URL } from "@lib/wiki";

export type Minutes = CollectionEntry<"blog">;

export type ActionItem = {
  task: string;
  assignee?: string;
  /** Deadline as written in the minutes, e.g. "May 5, 2026" or "Next Meeting". */
  deadlineText?: string;
  /** Parsed deadline (ISO date), when the text is a real date. */
  deadline?: string;
  status: string;
  done: boolean;
  meeting: Minutes;
};

export async function getMinutes() {
  return (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const MODE_LABEL = {
  online: "💻 Online",
  "in-person": "📍 In person",
  hybrid: "🔀 Hybrid",
} as const;

/** Returns the markdown under a `## Heading` (up to the next `## `), matched case-insensitively. */
export function getSection(body: string, heading: RegExp) {
  const lines = body.split("\n");
  const start = lines.findIndex((line) => /^##\s/.test(line) && heading.test(line));
  if (start === -1) return "";
  const end = lines.findIndex((line, i) => i > start && /^##\s/.test(line));
  return lines.slice(start + 1, end === -1 ? undefined : end).join("\n");
}

const stripMarkdown = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .trim();

function parseDeadline(text: string | undefined, meetingDate: Date) {
  if (!text) return undefined;
  const cleaned = stripMarkdown(text);
  // Dates without a year ("May 12") inherit the meeting's year.
  const withYear = /\d{4}/.test(cleaned) ? cleaned : `${cleaned} ${meetingDate.getFullYear()}`;
  const parsed = new Date(withYear);
  if (Number.isNaN(parsed.valueOf()) || !/\d/.test(cleaned)) return undefined;
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()))
    .toISOString()
    .slice(0, 10);
}

const DONE_STATUS = /^(done|completed?|closed|finished|✅)$/i;

/**
 * Extracts action items from the `## Action Items` section. Two formats are supported:
 *
 *   - [ ] Task description - **Assignee** - Deadline
 *
 *   | Action Item | Assignee | Deadline | Status |
 */
export function parseActionItems(meeting: Minutes): ActionItem[] {
  const section = getSection(meeting.body ?? "", /action items?/i);
  const items: ActionItem[] = [];
  let columns: string[] | undefined;

  for (const raw of section.split("\n")) {
    const line = raw.trim();

    const checkbox = line.match(/^[-*]\s+\[( |x|X)\]\s+(.+)$/);
    if (checkbox) {
      const [task, assignee, ...rest] = checkbox[2].split(/\s+[-–—]\s+/);
      const done = checkbox[1].toLowerCase() === "x";
      const deadlineText = rest.length ? stripMarkdown(rest.join(" - ")) : undefined;
      items.push({
        task: stripMarkdown(task),
        assignee: assignee ? stripMarkdown(assignee) : undefined,
        deadlineText,
        deadline: parseDeadline(deadlineText, meeting.data.date),
        status: done ? "Done" : "Open",
        done,
        meeting,
      });
      continue;
    }

    if (line.startsWith("|")) {
      const cells = line.replace(/^\||\|$/g, "").split("|").map((cell) => stripMarkdown(cell));
      if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
      if (!columns) {
        columns = cells.map((cell) => cell.toLowerCase());
        continue;
      }
      const col = (pattern: RegExp) => {
        const index = columns!.findIndex((name) => pattern.test(name));
        return index === -1 ? undefined : cells[index] || undefined;
      };
      const task = col(/action|task|item/) ?? cells[0];
      const status = col(/status/) ?? "Open";
      const deadlineText = col(/deadline|due|date/);
      const done = DONE_STATUS.test(status);
      items.push({
        task,
        assignee: col(/assignee|owner|who/),
        deadlineText,
        deadline: parseDeadline(deadlineText, meeting.data.date),
        status: done ? "Done" : status,
        done,
        meeting,
      });
      continue;
    }

    // A blank line or other content ends a table.
    if (columns && line === "") columns = undefined;
  }
  return items;
}

/** Splits "Samad & Shaan" / "Ashwin + Media" into individual names for filtering. */
export function assigneeNames(assignee: string | undefined) {
  if (!assignee) return [];
  return assignee
    .split(/\s*(?:&|\+|,|\band\b)\s*/i)
    .map((name) => name.trim())
    .filter(Boolean);
}

/** Other meetings sharing the most tags with this one. */
export function relatedMinutes(meeting: Minutes, all: Minutes[], limit = 3) {
  const tags = new Set(meeting.data.tags ?? []);
  return all
    .filter((other) => other.id !== meeting.id)
    .map((other) => ({
      other,
      score: (other.data.tags ?? []).filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.data.date.valueOf() - a.other.data.date.valueOf())
    .slice(0, limit)
    .map(({ other }) => other);
}

export function minutesEditUrl(meeting: Minutes) {
  return meeting.filePath ? `${REPO_URL}/edit/main/${meeting.filePath}` : undefined;
}

export function minutesHistoryUrl(meeting: Minutes) {
  return meeting.filePath ? `${REPO_URL}/commits/main/${meeting.filePath}` : undefined;
}

export function newMinutesUrl() {
  const today = new Date().toISOString().slice(0, 10);
  const template = `---
title: "Meeting Title"
description: "Brief summary of key decisions."
date: "${today}"
time: "4:00 PM – 5:00 PM IST"
location: "Online"
mode: "online"
attendees: ["Name 1", "Name 2"]
minuteTaker: "Name"
tags: ["planning"]
---

## Agenda

- Agenda item

## Discussions & Key Decisions

### 1. Topic

Notes and decisions.

## Action Items

| Action Item | Assignee | Deadline | Status |
| :--- | :--- | :--- | :--- |
| Describe the task | Name | ${today} | Pending |
`;
  const params = new URLSearchParams({ filename: `${today}-meeting-slug/index.md`, value: template });
  return `${REPO_URL}/new/main/src/content/blog?${params}`;
}
