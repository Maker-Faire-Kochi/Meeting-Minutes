import { getCollection, type CollectionEntry } from "astro:content";

export type WikiEntry = CollectionEntry<"wiki">;

export type WikiNode = {
  /** Raw entry id path, e.g. "02-operations/volunteers" ("" for the wiki home). */
  key: string;
  /** URL slug without numeric prefixes, e.g. "operations/volunteers". */
  slug: string;
  href: string;
  title: string;
  /** Shorter label for the sidebar (falls back to title). */
  navTitle: string;
  icon?: string;
  order: number;
  hidden: boolean;
  depth: number;
  entry?: WikiEntry;
  parent?: WikiNode;
  children: WikiNode[];
};

export const REPO_URL = "https://github.com/Maker-Faire-Kochi/Meeting-Minutes";
export const WIKI_CONTENT_DIR = "src/content/wiki";

const ORDER_PREFIX = /^\d+[-_]/;

function stripPrefix(segment: string) {
  return segment.replace(ORDER_PREFIX, "");
}

function humanize(segment: string) {
  const text = stripPrefix(segment).replace(/[-_]+/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The glob loader gives the root `index.md` the id "index"; folder index files get the folder's id. */
export function keyFor(id: string) {
  return id === "index" ? "" : id;
}

export function slugFor(id: string) {
  return keyFor(id).split("/").filter(Boolean).map(stripPrefix).join("/");
}

export function hrefFor(slug: string) {
  return slug ? `/wiki/${slug}` : "/wiki";
}

export function tagHref(tag: string) {
  return `/wiki/tags/${encodeURIComponent(tag)}`;
}

function compareNodes(a: WikiNode, b: WikiNode) {
  if (a.order !== b.order) return a.order - b.order;
  const byKey = a.key.localeCompare(b.key, undefined, { numeric: true });
  return byKey !== 0 ? byKey : a.title.localeCompare(b.title);
}

export async function getWikiEntries() {
  return (await getCollection("wiki")).filter((entry) => !entry.data.draft);
}

/** Builds the nested nav tree from entry id paths. The root node is the wiki home. */
export function buildWikiTree(entries: WikiEntry[]): WikiNode {
  const nodes = new Map<string, WikiNode>();

  function getNode(key: string): WikiNode {
    let node = nodes.get(key);
    if (node) return node;

    const segments = key.split("/").filter(Boolean);
    const slug = segments.map(stripPrefix).join("/");
    const title = segments.length ? humanize(segments[segments.length - 1]) : "Wiki";
    node = {
      key,
      slug,
      href: hrefFor(slug),
      title,
      navTitle: title,
      order: 100,
      hidden: false,
      depth: segments.length,
      children: [],
    };
    nodes.set(key, node);

    if (segments.length) {
      const parent = getNode(segments.slice(0, -1).join("/"));
      node.parent = parent;
      parent.children.push(node);
    }
    return node;
  }

  for (const entry of entries) {
    const node = getNode(keyFor(entry.id));
    node.entry = entry;
    node.title = entry.data.title;
    node.navTitle = entry.data.navTitle ?? entry.data.title;
    node.icon = entry.data.icon;
    node.order = entry.data.order;
    node.hidden = entry.data.hidden ?? false;
  }

  const root = getNode("");
  const sortTree = (node: WikiNode) => {
    node.children.sort(compareNodes);
    node.children.forEach(sortTree);
  };
  sortTree(root);
  return root;
}

/** Visible children (hidden pages stay reachable by URL but are left out of navigation). */
export function visibleChildren(node: WikiNode) {
  return node.children.filter((child) => !child.hidden);
}

/** Pages with content in reading order (depth-first), used for prev/next links. */
export function flattenTree(root: WikiNode, { includeHidden = false } = {}): WikiNode[] {
  const pages: WikiNode[] = [];
  const walk = (node: WikiNode) => {
    if (node.hidden && !includeHidden) return;
    if (node.entry) pages.push(node);
    node.children.forEach(walk);
  };
  walk(root);
  return pages;
}

/** Chain of nodes from the root down to (and including) the given node. */
export function getTrail(node: WikiNode): WikiNode[] {
  const trail: WikiNode[] = [];
  for (let current: WikiNode | undefined = node; current; current = current.parent) {
    trail.unshift(current);
  }
  return trail;
}

export function findNode(root: WikiNode, key: string) {
  const segments = key.split("/").filter(Boolean);
  let current: WikiNode | undefined = root;
  for (let i = 0; i < segments.length && current; i++) {
    const childKey = segments.slice(0, i + 1).join("/");
    current = current.children.find((child) => child.key === childKey);
  }
  return current;
}

export function isInBranch(node: WikiNode, activeKey: string) {
  return node.key === activeKey || activeKey.startsWith(`${node.key}/`);
}

/** Top-level section a node belongs to (undefined for the wiki home). */
export function sectionOf(node: WikiNode) {
  return getTrail(node)[1];
}

function normalizePath(path: string) {
  return path.replace(/[#?].*$/, "").replace(/\/+$/, "") || "/";
}

/** Map of page href → pages whose body links to it. */
export function buildBacklinks(pages: WikiNode[]) {
  const byHref = new Map(pages.map((page) => [page.href, page]));
  const backlinks = new Map<string, WikiNode[]>();
  const linkPattern = /\]\((\/wiki[^)\s]*)\)|href=["'](\/wiki[^"']*)["']/g;

  for (const page of pages) {
    const body = page.entry?.body ?? "";
    const targets = new Set<string>();
    for (const match of body.matchAll(linkPattern)) {
      const target = byHref.get(normalizePath(match[1] ?? match[2]));
      if (target && target !== page) targets.add(target.href);
    }
    for (const href of targets) {
      backlinks.set(href, [...(backlinks.get(href) ?? []), page]);
    }
  }
  return backlinks;
}

/** Map of tag → pages, sorted by tag name. */
export function buildTagIndex(pages: WikiNode[]) {
  const tags = new Map<string, WikiNode[]>();
  for (const page of pages) {
    for (const tag of page.entry?.data.tags ?? []) {
      tags.set(tag, [...(tags.get(tag) ?? []), page]);
    }
  }
  return new Map([...tags.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function recentlyUpdated(pages: WikiNode[], limit = 5) {
  return pages
    .filter((page) => page.entry?.data.lastUpdated)
    .sort(
      (a, b) =>
        b.entry!.data.lastUpdated!.valueOf() - a.entry!.data.lastUpdated!.valueOf(),
    )
    .slice(0, limit);
}

/** Folder (relative to the repo root) where sub-pages of this page should be created. */
export function subPageDir(entry: WikiEntry) {
  const filePath = entry.filePath ?? `${WIKI_CONTENT_DIR}/${entry.id}.md`;
  return /\/index\.mdx?$/.test(filePath)
    ? filePath.replace(/\/index\.mdx?$/, "")
    : filePath.replace(/\.mdx?$/, "");
}

export function newSubPageUrl(entry: WikiEntry) {
  const today = new Date().toISOString().slice(0, 10);
  const template = `---
title: "New Page"
description: "What this page covers in one sentence."
lastUpdated: "${today}"
status: "stub"
---

## Overview

`;
  const params = new URLSearchParams({
    filename: "new-page.md",
    value: template,
  });
  return `${REPO_URL}/new/main/${subPageDir(entry)}?${params}`;
}

export function editUrl(entry: WikiEntry) {
  return entry.filePath ? `${REPO_URL}/edit/main/${entry.filePath}` : undefined;
}

export function historyUrl(entry: WikiEntry) {
  return entry.filePath ? `${REPO_URL}/commits/main/${entry.filePath}` : undefined;
}

export const STATUS_META = {
  stub: {
    label: "Stub",
    message: "This page is a stub. It needs more detail; help by expanding it.",
  },
  "in-progress": {
    label: "In progress",
    message: "This page is being written and may change.",
  },
  stable: {
    label: "Stable",
    message: "",
  },
  outdated: {
    label: "Outdated",
    message: "This page may be out of date. Check recent minutes before relying on it.",
  },
} as const;

export type WikiStatus = keyof typeof STATUS_META;
