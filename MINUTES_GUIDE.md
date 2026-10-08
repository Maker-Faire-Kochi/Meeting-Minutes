# Maker Faire Kochi: Meeting Minutes Posting Guide

This guide explains how to add new meeting minutes to the website repository to ensure a consistent format and a successful static site build.

---

## 📂 Directory Structure

All meeting minutes are stored under `src/content/blog/` as folder-based entries. Each entry must follow this structure:

```bash
src/content/blog/
  └── YYYY-MM-DD-short-slug/
      └── index.md
```

- **Folder Name:** Use the date of the meeting followed by a short kebab-case description (e.g., `2026-06-07-narrative-design`).
- **File Name:** Must be exactly `index.md` (or `index.mdx` if using MDX components).

---

## 🏷️ Frontmatter Configuration

At the very top of your `index.md` file, include a YAML frontmatter block. The **meeting details live here** (not in the body). The site shows them in a details panel at the top of the page, and uses them for search and filters.

```yaml
---
title: "Title of the Meeting Minutes"
description: "A short 1-2 sentence summary of what was discussed or decided."
date: "YYYY-MM-DD"
tags: ["planning", "sponsorship"]
time: "4:00 PM – 5:00 PM IST"
location: "Finger Space"
mode: "hybrid"                       # online | in-person | hybrid
attendees: ["Name 1", "Name 2"]      # in-person attendees (or everyone, if not hybrid)
remoteAttendees: ["Name 3"]          # hybrid meetings only: who joined online
minuteTaker: "Name"
resources:                           # optional links shown under the minutes
  - title: "Event flow document"
    url: "https://docs.google.com/..."
---
```

### Frontmatter Fields:
- **`title`**, **`description`**, **`date`**: Required. The title, the summary shown in lists and search, and the date used for sorting.
- **`tags`**: Topics for filtering (e.g. `["site-visit", "venue"]`). Reuse existing tags where possible; see `/tags`.
- **`time`**, **`location`**, **`mode`**, **`attendees`**, **`remoteAttendees`**, **`minuteTaker`**: Optional meeting details. Anything left out shows as "Not recorded".
- **`resources`**: Optional list of `title` + `url` links (docs, decks, sheets).
- **`draft: true`**: Hides the minutes from the site.

> 💡 The **➕ New minutes** button on the `/blog` page opens GitHub's editor with this template already filled in.

---

## 📝 Document Formatting Rules

To maintain high visual quality and avoid build-time errors, please follow these guidelines:

### 1. Heading Levels (CRITICAL)
- **Do NOT use level 1 headings (`# Heading`) in the body.** The title from your frontmatter is automatically rendered as the H1 title of the page.
- **Always start your body headings with level 2 (`## Heading`).**
- **Never place a level 3 heading (`### Subheading`) before a level 2 heading.** The Table of Contents (TOC) generator expects level 2 headings to be parent nodes. Placing level 3 headings first will cause the static build compiler to crash.

### 2. Standard Document Outline
Standardize the flow of your meeting minutes using these sections. Meeting details go in the frontmatter, not the body:
- `## Agenda` (bulleted list)
- `## Discussions & Key Decisions` (broken down into H3 sections, e.g. `### 1. Venue Selection`)
- `## Action Items` (a markdown table or checkbox list with assignees and dates; see below)
- `## Timeline & Next Steps`

---

## ✅ Action Items & the Action Tracker

Action items are **read automatically** from the `## Action Items` section and collected on the **Action tracker** page (`/blog/actions`). There you can filter by person and status, and items past their deadline are flagged as overdue. Use one of these two formats:

```markdown
| Action Item | Assignee | Deadline | Status |
| :--- | :--- | :--- | :--- |
| Draft the sponsor deck | Abhiram | Jun 18, 2026 | Pending |
| Book the venue | Samad & Shaan | 2026-07-01 | Done |
```

```markdown
- [ ] Draft the sponsor deck - **Abhiram** - Jun 18, 2026
- [x] Book the venue - **Samad & Shaan** - 2026-07-01
```

- **Closing an item:** set the status to `Done` (tables) or tick the box with `[x]` (checklists) in the original minutes.
- **Deadlines** can be written as `Jun 18, 2026`, `June 18, 2026` or `2026-06-18`. Anything else (e.g. "Next meeting") is shown as written, without overdue tracking.
- **Several people:** separate names with `&`, `+`, `,` or `and`. Each person then appears separately in the tracker's filter.

---

## ✍️ Callouts

Highlight key decisions or warnings with GitHub-style callouts:

```markdown
> [!IMPORTANT] Decision
> The event will run in the first week of November.
```

Supported types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.

---

## 📋 Copy-Paste Template

Below is the standard blank template. Copy this code into your new `index.md` file to get started:

```markdown
---
title: "Meeting Title Here"
description: "Brief summary of key decisions."
date: "2026-06-13"
tags: ["planning"]
time: "4:00 PM – 5:00 PM IST"
location: "Online"
mode: "online"
attendees: ["Attendee 1", "Attendee 2", "Attendee 3"]
minuteTaker: "Attendee 1"
---

## Agenda

- Agenda Item 1
- Agenda Item 2

---

## Discussions & Key Decisions

### 1. Topic Title One
Provide clear context regarding what was discussed and what decisions were finalized.

### 2. Topic Title Two
Add details on subsequent topics. Use bold text to highlight major outcomes.

---

## Action Items

| Action Item | Assignee | Deadline | Status |
| :--- | :--- | :--- | :--- |
| Describe the task here | Name | Jun 20, 2026 | Pending |
| Describe another task | Name | Jun 25, 2026 | Pending |

---

## Timeline & Next Steps

Summarize the dependencies or targets for the next sync session.
```
