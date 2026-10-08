# Maker Faire Kochi: Wiki Guide

The **Wiki** at `/wiki` is our long-lived knowledge base for how Maker Faire Kochi is planned and run. Minutes record *what was decided*. The wiki records *how we do things*.

The full contributor docs live **inside the wiki itself** under [Contributing](/wiki/contributing), with sub-pages for *Pages & Sub-pages* and the *Formatting Reference*. Source files: `src/content/wiki/05-contributing/`. This file is a quick summary for people working in the repo.

> ⚠️ **The wiki is public.** Don't add personal phone numbers, private emails, contracts, invoices, or confidential financials.

---

## 📂 Structure

```bash
src/content/wiki/
  index.md                     # /wiki (wiki home)
  02-operations/
    index.md                   # /wiki/operations (section overview)
    volunteers.md              # /wiki/operations/volunteers
    volunteers/                # sub-pages of "Volunteers" (same name as the page)
      squads.md                # /wiki/operations/volunteers/squads
```

- Each top-level folder is a sidebar **section**. Its `index.md` is the overview page.
- **Sub-pages:** put them in a folder named like the parent page (`volunteers.md` + `volunteers/`). Nesting can go as deep as you need.
- **Numeric prefixes** (`01-`) control order and are stripped from URLs.
- `all` and `tags` are reserved top-level names.

## 🏷️ Frontmatter

```yaml
---
title: "Volunteer Squads"           # required
navTitle: "Squads"                  # shorter sidebar label
description: "One-sentence summary"
icon: "🛠️"
order: 2                            # default 100
lastUpdated: "2026-10-08"
status: "stub"                      # stub | in-progress | stable | outdated
owner: "Operations team"
tags: ["volunteers"]
related: ["operations/volunteers"]  # wiki paths without /wiki/
hidden: true                        # out of nav, still reachable by URL
draft: true                         # not published
---
```

## ✍️ Callouts

```markdown
> [!NOTE]        > [!TIP]        > [!IMPORTANT]        > [!WARNING]        > [!CAUTION] Custom title
> Body text...
```

These work in the minutes too. The implementation is in `src/lib/remark-callouts.mjs`.

## ⚙️ Features & where they live

| Feature | File |
| :--- | :--- |
| Tree, ordering, backlinks, tags, GitHub URLs | `src/lib/wiki.ts` |
| Page template (meta, status banner, sub-pages, related, backlinks, actions) | `src/pages/wiki/[...slug].astro` |
| All pages (A–Z) / Tags | `src/pages/wiki/all.astro`, `src/pages/wiki/tags/` |
| 3-column layout | `src/layouts/WikiLayout.astro` |
| Sidebar, filter, expand/collapse | `src/components/wiki/WikiSidebar*.astro` |
| Heading anchors, scroll-spy TOC, copy link | `src/components/DocScripts.astro` (shared with the minutes) |
