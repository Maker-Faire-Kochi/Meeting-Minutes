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
