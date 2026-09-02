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
  url: string;
}

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
