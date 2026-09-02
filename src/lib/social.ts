import socialConfig from '../../data/config/social.json';
import type { SocialLink, SocialPlatform } from './social-types';

export type { SocialLink, SocialPlatform } from './social-types';
export { socialLabels } from './social-types';

export const socialLinks: SocialLink[] = socialConfig.links
  .filter((link) => link.url.trim() !== '') as SocialLink[];
