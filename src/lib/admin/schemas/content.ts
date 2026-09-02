import { z } from 'zod';
import { LOCALES } from '../config';

export const localeSchema = z.enum(LOCALES);

export const slugSchema = z
  .string()
  .min(1, 'slug_required')
  .max(80, 'slug_too_long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'invalid_slug');

export const optionalSlugSchema = z.union([slugSchema, z.literal('')]).optional();

export const assetPathSchema = z
  .string()
  .max(200)
  .regex(/^\/[a-zA-Z0-9/_.-]*$/, 'invalid_path')
  .optional()
  .or(z.literal(''));

export const optionalUrlSchema = z
  .string()
  .url('invalid_url')
  .max(500)
  .optional()
  .or(z.literal(''));

export const articleFrontmatterSchema = z.object({
  title: z.string().min(1, 'title_required').max(200, 'title_too_long'),
  excerpt: z.string().min(1, 'excerpt_required').max(500, 'excerpt_too_long'),
  category: z.string().min(1, 'category_required').max(80, 'category_too_long'),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'invalid_date'),
  readingTime: z.coerce.number().int().min(1).max(999),
  tags: z.array(z.string().min(1).max(50)).max(20),
  cover: assetPathSchema,
  translationOf: optionalSlugSchema,
  draft: z.boolean().optional(),
});

export const articleSaveSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  previousSlug: optionalSlugSchema,
  sha: z.string().max(80).optional(),
  frontmatter: articleFrontmatterSchema,
  body: z.string().min(1, 'body_required').max(100_000, 'body_too_long'),
});

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1, 'title_required').max(200, 'title_too_long'),
  excerpt: z.string().min(1, 'excerpt_required').max(500, 'excerpt_too_long'),
  problem: z.string().min(1, 'problem_required').max(2000),
  solution: z.string().min(1, 'solution_required').max(2000),
  role: z.string().min(1, 'role_required').max(200),
  result: z.string().min(1, 'result_required').max(2000),
  technologies: z.array(z.string().min(1).max(50)).min(1).max(30),
  cover: z.string().min(1).regex(/^\/[a-zA-Z0-9/_.-]+$/, 'invalid_path'),
  order: z.coerce.number().int().min(1).max(999),
  featured: z.boolean().optional(),
  github: optionalUrlSchema,
  demo: optionalUrlSchema,
  translationOf: optionalSlugSchema,
  draft: z.boolean().optional(),
});

export const projectSaveSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  sha: z.string().max(80).optional(),
  frontmatter: projectFrontmatterSchema,
  body: z.string().min(1, 'body_required').max(100_000, 'body_too_long'),
});

export type ArticleSaveInput = z.infer<typeof articleSaveSchema>;
export type ProjectSaveInput = z.infer<typeof projectSaveSchema>;

export function formatZodError(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return 'validation_error';
  return issue.message;
}
