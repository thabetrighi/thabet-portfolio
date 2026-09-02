import { z } from 'zod';

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  fullName: z.object({
    ar: z.string().min(1),
    en: z.string().min(1),
    fr: z.string().min(1),
  }),
  logo: z.string(),
  email: z.string().email(),
  url: z.string().url(),
});

export const socialConfigSchema = z.object({
  links: z.array(z.object({
    platform: z.string().min(1),
    url: z.string(),
  })),
});

export const profileConfigSchema = z.object({
  experience: z.array(z.record(z.string(), z.unknown())),
  skills: z.array(z.record(z.string(), z.unknown())),
  about: z.object({
    summary: z.string(),
    extended: z.string(),
  }),
  resume: z.record(z.string(), z.unknown()),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;
export type SocialConfigInput = z.infer<typeof socialConfigSchema>;
export type ProfileConfigInput = z.infer<typeof profileConfigSchema>;
