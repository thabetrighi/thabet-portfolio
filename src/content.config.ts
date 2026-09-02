import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  category: z.string(),
  publishedAt: z.coerce.date(),
  readingTime: z.number(),
  tags: z.array(z.string()),
  cover: z.string().optional(),
  translationOf: z.string().optional(),
  draft: z.boolean().default(false),
});

const projectSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  problem: z.string(),
  solution: z.string(),
  role: z.string(),
  result: z.string(),
  technologies: z.array(z.string()),
  cover: z.string(),
  order: z.number(),
  featured: z.boolean().default(true),
  company: z.string().optional(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  translationOf: z.string().optional(),
  draft: z.boolean().default(false),
});

export const collections = {
  'articles-ar': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/articles/ar' }),
    schema: articleSchema,
  }),
  'articles-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/articles/en' }),
    schema: articleSchema,
  }),
  'articles-fr': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/articles/fr' }),
    schema: articleSchema,
  }),
  'projects-ar': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/projects/ar' }),
    schema: projectSchema,
  }),
  'projects-en': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/projects/en' }),
    schema: projectSchema,
  }),
  'projects-fr': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/projects/fr' }),
    schema: projectSchema,
  }),
};
