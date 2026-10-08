import { getCollection, type CollectionEntry } from "astro:content";
import { REPO_URL } from "@lib/wiki";
import { getSection, type Minutes } from "@lib/minutes";

export type Milestone = CollectionEntry<"projects">;
export type MilestoneStatus = NonNullable<Milestone["data"]["status"]>;

export async function getMilestones() {
  return (await getCollection("projects"))
    .filter((milestone) => !milestone.data.draft)
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}

export const STATUS_META: Record<MilestoneStatus | "unset", { label: string; badge: string; dot: string }> = {
  planned: {
    label: "Planned",
    badge: "border-black/15 dark:border-white/20",
    dot: "border-black/30 bg-neutral-100 dark:border-white/40 dark:bg-neutral-900",
  },
  "in-progress": {
    label: "In progress",
    badge: "border-primary/50 bg-primary/10 text-black dark:text-white",
    dot: "border-primary bg-primary",
  },
  "at-risk": {
    label: "At risk",
    badge: "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    dot: "border-amber-500 bg-amber-500",
  },
  blocked: {
    label: "Blocked",
    badge: "border-secondary/50 bg-secondary/10 text-secondary",
    dot: "border-secondary bg-secondary",
  },
  done: {
    label: "Done",
    badge: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "border-emerald-500 bg-emerald-500",
  },
  unset: {
    label: "No status",
    badge: "border-dashed border-black/20 dark:border-white/25",
    dot: "border-dashed border-black/30 bg-neutral-100 dark:border-white/40 dark:bg-neutral-900",
  },
};

export function statusOf(milestone: Milestone) {
  return milestone.data.status ?? "unset";
}

/** Counts `- [ ]` / `- [x]` steps anywhere in the milestone body. */
export function getProgress(milestone: Milestone) {
  const steps = [...(milestone.body ?? "").matchAll(/^\s*[-*]\s+\[( |x|X)\]\s+/gm)];
  const done = steps.filter((step) => step[1].toLowerCase() === "x").length;
  const total = steps.length;
  // A milestone marked done counts as complete even if its checklist wasn't ticked.
  const percent =
    milestone.data.status === "done" ? 100 : total ? Math.round((done / total) * 100) : 0;
  return { done, total, percent };
}

/** The milestone's goal, taken from its `## Milestone Goal` section when present. */
export function getGoal(milestone: Milestone) {
  return getSection(milestone.body ?? "", /goal/i).trim();
}

/** Meetings linked from the milestone's `minutes` field, plus minutes that link to the milestone. */
export function linkedMinutes(milestone: Milestone, minutes: Minutes[]) {
  const ids = new Set(milestone.data.minutes ?? []);
  const href = `/projects/${milestone.id}`;
  return minutes.filter((meeting) => ids.has(meeting.id) || (meeting.body ?? "").includes(href));
}

export function milestoneEditUrl(milestone: Milestone) {
  return milestone.filePath ? `${REPO_URL}/edit/main/${milestone.filePath}` : undefined;
}

export function milestoneHistoryUrl(milestone: Milestone) {
  return milestone.filePath ? `${REPO_URL}/commits/main/${milestone.filePath}` : undefined;
}
