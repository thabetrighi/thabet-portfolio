export type SocialPlatform =
  | 'github'
  | 'gitlab'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'stackoverflow'
  | 'mastodon'
  | 'devto'
  | 'medium';

export interface SocialLink {
  platform: SocialPlatform;
  /** Full URL — leave empty string to hide */
  url: string;
}

/**
 * Social profiles — edit URLs here. Empty = hidden.
 * See docs/CONTENT-GUIDE.md for details.
 */
export const socialLinks: SocialLink[] = [
  { platform: 'github', url: 'https://github.com/thabet' },
  { platform: 'gitlab', url: '' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/thabet' },
  { platform: 'facebook', url: '' },
  { platform: 'x', url: 'https://x.com/thabet' },
  { platform: 'instagram', url: '' },
  { platform: 'youtube', url: '' },
  { platform: 'stackoverflow', url: '' },
  { platform: 'devto', url: '' },
].filter((link) => link.url.trim() !== '');

export const socialLabels: Record<SocialPlatform, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  twitter: 'Twitter',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  stackoverflow: 'Stack Overflow',
  mastodon: 'Mastodon',
  devto: 'DEV',
  medium: 'Medium',
};
