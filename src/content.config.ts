import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    // Meeting details (all optional, shown in the meeting info panel)
    time: z.string().optional(),
    location: z.string().optional(),
    mode: z.enum(["online", "in-person", "hybrid"]).optional(),
    attendees: z.array(z.string()).optional(),
    remoteAttendees: z.array(z.string()).optional(),
    minuteTaker: z.string().optional(),
    resources: z
      .array(z.object({ title: z.string(), url: z.string().url() }))
      .optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    // Roadmap tracking (all optional)
    status: z.enum(["planned", "in-progress", "at-risk", "blocked", "done"]).optional(),
    owner: z.string().optional(),
    /** Ids of meeting minutes (folder names under src/content/blog) where this milestone was discussed. */
    minutes: z.array(z.string()).optional(),
  }),
});

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/wiki" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(100),
    draft: z.boolean().optional(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    // Wiki-specific fields
    navTitle: z.string().optional(),
    icon: z.string().optional(),
    hidden: z.boolean().optional(),
    status: z.enum(["stub", "in-progress", "stable", "outdated"]).optional(),
    owner: z.string().optional(),
    related: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, projects, wiki };
