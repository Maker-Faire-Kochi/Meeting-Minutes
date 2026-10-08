---
title: "Formatting Reference"
description: "Callouts, tables, checklists, and other formatting you can use on wiki pages."
order: 2
lastUpdated: "2026-10-08"
tags: ["meta"]
related: ["contributing/pages-and-sub-pages"]
---

## Headings

Don't use a `#` H1 in the body, because the `title` is already the page heading. Start with `## H2` and use `### H3` underneath. These headings make up the **On this page** panel, and hovering over one shows a **#** link you can copy.

## Callouts

Start a quote block with a type marker to turn it into a callout:

```markdown
> [!NOTE]
> Useful background information.

> [!TIP] Custom title here
> A helpful suggestion.
```

> [!NOTE]
> Useful background information.

> [!TIP]
> A helpful suggestion.

> [!IMPORTANT]
> Something readers must not miss.

> [!WARNING]
> A risk to be careful about.

> [!CAUTION] Custom title here
> Something that could cause real problems.

A plain `>` quote without a marker stays a normal quote.

## Checklists

```markdown
- [x] Done item
- [ ] Open item
```

- [x] Done item
- [ ] Open item

## Tables

```markdown
| Squad | Lead |
| :--- | :--- |
| Welcoming | TBD |
```

| Squad | Lead |
| :--- | :--- |
| Welcoming | TBD |

## Code and keyboard keys

Wrap inline code in single backticks, as in `npm run dev`. For keyboard keys, use `<kbd>/</kbd>`, which renders as <kbd>/</kbd>.
