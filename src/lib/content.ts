import type { Locale } from '../i18n/config';
import profileAr from '../../data/profile/ar.json';
import profileEn from '../../data/profile/en.json';
import profileFr from '../../data/profile/fr.json';

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
  technologies: string[];
  /** Key accomplishments at this role — not individual platform listings */
  highlights: string[];
  /** Platforms/systems worked on — shown as internal tags in the experience section */
  platformTags: string[];
}

export interface SkillArea {
  name: string;
  items: string[];
}

export interface ResumeData {
  profile: string;
  education: {
    institution: string;
    degree: string;
    period: string;
    location: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
  cvFiles: {
    ar?: string;
    en?: string;
    fr?: string;
  };
}

interface ProfileData {
  experience: Experience[];
  skills: SkillArea[];
  about: { summary: string; extended: string };
  resume: ResumeData;
}

const profiles: Record<Locale, ProfileData> = {
  ar: profileAr,
  en: profileEn,
  fr: profileFr,
};

export function getExperience(locale: Locale): Experience[] {
  return profiles[locale].experience;
}

export function getSkills(locale: Locale): SkillArea[] {
  return profiles[locale].skills;
}

export function getAbout(locale: Locale) {
  return profiles[locale].about;
}

export function getResume(locale: Locale): ResumeData {
  return profiles[locale].resume;
}

export function getProjectCollection(locale: Locale) {
  return `projects-${locale}` as const;
}

export function getArticleCollection(locale: Locale) {
  return `articles-${locale}` as const;
}
