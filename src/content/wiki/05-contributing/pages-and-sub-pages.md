---
title: "Pages & Sub-pages"
description: "How folders become the sidebar, how ordering works, and every frontmatter option."
order: 1
lastUpdated: "2026-10-08"
tags: ["meta"]
---

## Folders are the sidebar

Every page is a Markdown file under `src/content/wiki/`. **The folder structure is the navigation.**

```bash
src/content/wiki/
  index.md                       → /wiki
  02-operations/
    index.md                     → /wiki/operations           (section overview)
    volunteers.md                → /wiki/operations/volunteers
    volunteers/                  ← sub-pages of "Volunteers"
      squads.md                  → /wiki/operations/volunteers/squads
      training.md                → /wiki/operations/volunteers/training
```

- Each **top-level folder** is a sidebar section. Its `index.md` is the overview page, and its title is the section's name.
- To give any page **sub-pages**, create a folder with the **same name** as the page file (without `.md`) next to it, and put the sub-pages inside. Sub-pages can nest as deep as you need.
- You can also write a page as `folder/index.md` instead of `folder.md`. Both work, but don't use both for the same page.
- **Numeric prefixes** like `01-` or `02-` set the order and are dropped from URLs.
- Use lowercase kebab-case file names: `sponsor-tiers.md`, not `Sponsor Tiers.md`.
- `all` and `tags` are reserved names at the top level (they're used by [All pages](/wiki/all) and [Tags](/wiki/tags)).

Pages with sub-pages get a collapsible arrow in the sidebar and a **Sub-pages** list at the bottom.

## Frontmatter reference

```yaml
---
title: "Volunteer Squads"          # required, page heading
navTitle: "Squads"                 # shorter label for the sidebar
description: "One-sentence summary" # shown under the title, in cards and search
icon: "🛠️"                          # emoji shown in sidebar, cards and title
order: 2                           # sort order among siblings (lower first, default 100)
lastUpdated: "2026-10-08"          # shown on the page and used for "Recently updated"
status: "stub"                     # stub | in-progress | stable | outdated
owner: "Operations team"           # who keeps this page current
tags: ["volunteers", "safety"]     # listed on the Tags page
related: ["operations/volunteers"] # wiki paths (without /wiki/) shown as "Related pages"
hidden: true                       # left out of sidebar and lists, still reachable by URL
draft: true                        # not published at all
---
```

## Page status

| Status | Meaning |
| :--- | :--- |
| `stub` | Skeleton only, needs content (shows a banner asking for help) |
| `in-progress` | Being written, may change |
| `stable` | Reviewed and reliable |
| `outdated` | Probably out of date (shows a warning banner) |

## Links between pages

Link to another wiki page by its URL: `[Squads](/wiki/operations/volunteers/squads)`. The page you link to shows yours under **Linked from**, so related knowledge stays connected.
