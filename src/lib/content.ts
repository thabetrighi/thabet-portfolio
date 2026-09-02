import type { Locale } from '../i18n/config';

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
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

const experience: Record<Locale, Experience[]> = {
  en: [
    {
      company: 'TechFlow SaaS',
      position: 'Senior Software Engineer',
      startDate: '2022',
      endDate: null,
      location: 'Remote',
      description:
        'Lead backend architecture for a multi-tenant analytics platform serving 200+ enterprise clients.',
      technologies: ['Laravel', 'PostgreSQL', 'Redis', 'Cloudflare Workers'],
      achievements: [
        'Reduced API response time by 60% through query optimization and edge caching',
        'Designed event-driven pipeline processing 2M events/day',
        'Mentored team of 4 engineers on API design patterns',
      ],
    },
    {
      company: 'DigitalCraft Agency',
      position: 'Full-Stack Developer',
      startDate: '2019',
      endDate: '2022',
      location: 'Algiers, Algeria',
      description:
        'Built custom web applications and e-commerce solutions for regional clients.',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Docker'],
      achievements: [
        'Delivered 12 client projects on time and within budget',
        'Introduced CI/CD pipeline reducing deployment time from hours to minutes',
        'Built reusable component library adopted across projects',
      ],
    },
    {
      company: 'StartupLab',
      position: 'Backend Developer',
      startDate: '2017',
      endDate: '2019',
      location: 'Remote',
      description:
        'Developed REST APIs and microservices for early-stage SaaS products.',
      technologies: ['PHP', 'Node.js', 'MongoDB', 'AWS'],
      achievements: [
        'Architected authentication system used across 3 products',
        'Implemented automated testing increasing coverage to 85%',
      ],
    },
  ],
  ar: [
    {
      company: 'TechFlow SaaS',
      position: 'مهندس برمجيات أول',
      startDate: '2022',
      endDate: null,
      location: 'عن بُعد',
      description:
        'قيادة الهندسة الخلفية لمنصة تحليلات متعددة المستأجرين تخدم أكثر من 200 عميل مؤسسي.',
      technologies: ['Laravel', 'PostgreSQL', 'Redis', 'Cloudflare Workers'],
      achievements: [
        'تقليل زمن استجابة API بنسبة 60% عبر تحسين الاستعلامات والتخزين المؤقت على الحافة',
        'تصميم خط أنابيب قائم على الأحداث يعالج 2 مليون حدث يوميًا',
        'إرشاد فريق من 4 مهندسين حول أنماط تصميم API',
      ],
    },
    {
      company: 'DigitalCraft Agency',
      position: 'مطور Full-Stack',
      startDate: '2019',
      endDate: '2022',
      location: 'الجزائر',
      description: 'بناء تطبيقات ويب مخصصة وحلول تجارة إلكترونية لعملاء إقليميين.',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Docker'],
      achievements: [
        'تسليم 12 مشروعًا للعملاء في الوقت المحدد',
        'إدخال خط CI/CD قلّص وقت النشر من ساعات إلى دقائق',
        'بناء مكتبة مكونات قابلة لإعادة الاستخدام',
      ],
    },
    {
      company: 'StartupLab',
      position: 'مطور Backend',
      startDate: '2017',
      endDate: '2019',
      location: 'عن بُعد',
      description: 'تطوير REST APIs وخدمات مصغرة لمنتجات SaaS ناشئة.',
      technologies: ['PHP', 'Node.js', 'MongoDB', 'AWS'],
      achievements: [
        'تصميم نظام مصادقة مستخدم عبر 3 منتجات',
        'تنفيذ اختبارات آلية رفعت التغطية إلى 85%',
      ],
    },
  ],
  fr: [
    {
      company: 'TechFlow SaaS',
      position: 'Ingénieur logiciel senior',
      startDate: '2022',
      endDate: null,
      location: 'Télétravail',
      description:
        'Direction de l\'architecture backend d\'une plateforme d\'analytics multi-tenant pour 200+ clients entreprise.',
      technologies: ['Laravel', 'PostgreSQL', 'Redis', 'Cloudflare Workers'],
      achievements: [
        'Réduction du temps de réponse API de 60% via optimisation et cache edge',
        'Conception d\'un pipeline événementiel traitant 2M événements/jour',
        'Mentorat d\'une équipe de 4 ingénieurs sur les patterns API',
      ],
    },
    {
      company: 'DigitalCraft Agency',
      position: 'Développeur Full-Stack',
      startDate: '2019',
      endDate: '2022',
      location: 'Alger, Algérie',
      description:
        'Développement d\'applications web et solutions e-commerce pour des clients régionaux.',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Docker'],
      achievements: [
        'Livraison de 12 projets clients dans les délais',
        'Introduction d\'un pipeline CI/CD réduisant le déploiement de heures à minutes',
        'Création d\'une bibliothèque de composants réutilisables',
      ],
    },
    {
      company: 'StartupLab',
      position: 'Développeur Backend',
      startDate: '2017',
      endDate: '2019',
      location: 'Télétravail',
      description:
        'Développement d\'API REST et microservices pour des produits SaaS en phase initiale.',
      technologies: ['PHP', 'Node.js', 'MongoDB', 'AWS'],
      achievements: [
        'Architecture d\'un système d\'authentification partagé entre 3 produits',
        'Mise en place de tests automatisés portant la couverture à 85%',
      ],
    },
  ],
};

const skills: Record<Locale, SkillArea[]> = {
  en: [
    { name: 'Backend', items: ['Laravel', 'PHP', 'Node.js', 'APIs', 'Databases'] },
    { name: 'Frontend', items: ['Vue', 'JavaScript', 'React', 'CSS', 'Modern Web'] },
    { name: 'Infrastructure', items: ['Cloudflare', 'Linux', 'Docker', 'CI/CD'] },
    { name: 'Architecture', items: ['SaaS', 'API Architecture', 'Distributed Systems', 'Performance', 'Security'] },
  ],
  ar: [
    { name: 'Backend', items: ['Laravel', 'PHP', 'Node.js', 'APIs', 'قواعد البيانات'] },
    { name: 'Frontend', items: ['Vue', 'JavaScript', 'React', 'CSS', 'الويب الحديث'] },
    { name: 'البنية التحتية', items: ['Cloudflare', 'Linux', 'Docker', 'CI/CD'] },
    { name: 'الهندسة المعمارية', items: ['SaaS', 'تصميم API', 'أنظمة موزعة', 'الأداء', 'الأمان'] },
  ],
  fr: [
    { name: 'Backend', items: ['Laravel', 'PHP', 'Node.js', 'APIs', 'Bases de données'] },
    { name: 'Frontend', items: ['Vue', 'JavaScript', 'React', 'CSS', 'Web moderne'] },
    { name: 'Infrastructure', items: ['Cloudflare', 'Linux', 'Docker', 'CI/CD'] },
    { name: 'Architecture', items: ['SaaS', 'Architecture API', 'Systèmes distribués', 'Performance', 'Sécurité'] },
  ],
};

const about: Record<Locale, { summary: string; extended: string }> = {
  en: {
    summary:
      'I think in systems. Whether it is an API contract, a database schema, or a deployment pipeline — I care about how pieces connect and how they fail gracefully.',
    extended:
      'Over eight years, I have moved between agency work and product teams. I prefer building products that solve real operational problems: dashboards that teams actually use, APIs that do not break at scale, and tools that respect the developer maintaining them.\n\nOutside of code, I write about backend architecture and infrastructure. I believe the best engineering decisions are the ones you can explain simply.',
  },
  ar: {
    summary:
      'أفكر بمنطق الأنظمة. سواء كان عقد API أو مخطط قاعدة بيانات أو خط نشر — يهمّني كيف تتصل القطع وكيف تتعامل مع الأعطال.',
    extended:
      'على مدى ثماني سنوات، انتقلت بين عمل الوكالات وفرق المنتجات. أفضل بناء منتجات تحل مشاكل تشغيلية حقيقية: لوحات يستخدمها الفريق فعلًا، وواجهات برمجة لا تنهار عند التوسع، وأدوات تحترم المطور الذي يصونها.\n\nخارج البرمجة، أكتب عن الهندسة الخلفية والبنية التحتية. أؤمن أن أفضل القرارات الهندسية هي التي يمكن شرحها ببساطة.',
  },
  fr: {
    summary:
      'Je pense en systèmes. Qu\'il s\'agisse d\'un contrat API, d\'un schéma de base de données ou d\'un pipeline de déploiement — je me soucie de la façon dont les pièces s\'assemblent et échouent proprement.',
    extended:
      'En huit ans, j\'ai alterné entre agences et équipes produit. Je préfère construire des produits qui résolvent de vrais problèmes opérationnels : des tableaux de bord utilisés, des API qui tiennent à l\'échelle, et des outils qui respectent le développeur qui les maintient.\n\nEn dehors du code, j\'écris sur l\'architecture backend et l\'infrastructure. Les meilleures décisions d\'ingénierie sont celles qu\'on peut expliquer simplement.',
  },
};

const resume: Record<Locale, ResumeData> = {
  en: {
    profile:
      'Software engineer with 8+ years building web products, APIs, and distributed systems. Experienced in Laravel, Vue.js, and Cloudflare infrastructure. Based in Algeria, working remotely with international teams.',
    education: [
      {
        institution: 'University of Science and Technology Houari Boumediene',
        degree: 'B.S. Computer Science',
        period: '2013 – 2017',
        location: 'Algiers, Algeria',
      },
    ],
    certifications: [
      { name: 'Cloudflare Developer Certification', issuer: 'Cloudflare', year: '2024' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2022' },
    ],
    languages: [
      { language: 'Arabic', level: 'Native' },
      { language: 'English', level: 'Professional' },
      { language: 'French', level: 'Professional' },
    ],
    cvFiles: { en: '/cv/thabet-cv-en.pdf', ar: '/cv/thabet-cv-ar.pdf', fr: '/cv/thabet-cv-fr.pdf' },
  },
  ar: {
    profile:
      'مهندس برمجيات بخبرة تتجاوز 8 سنوات في بناء منتجات ويب وواجهات برمجة وأنظمة موزعة. خبرة في Laravel وVue.js وبنية Cloudflare. مقيم في الجزائر، أعمل عن بُعد مع فرق دولية.',
    education: [
      {
        institution: 'جامعة العلوم والتكنولوجيا هواري بومدين',
        degree: 'بكالوريوس علوم الحاسوب',
        period: '2013 – 2017',
        location: 'الجزائر',
      },
    ],
    certifications: [
      { name: 'شهادة مطور Cloudflare', issuer: 'Cloudflare', year: '2024' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2022' },
    ],
    languages: [
      { language: 'العربية', level: 'لغة أم' },
      { language: 'الإنجليزية', level: 'احترافية' },
      { language: 'الفرنسية', level: 'احترافية' },
    ],
    cvFiles: { ar: '/cv/thabet-cv-ar.pdf', en: '/cv/thabet-cv-en.pdf', fr: '/cv/thabet-cv-fr.pdf' },
  },
  fr: {
    profile:
      'Ingénieur logiciel avec 8+ ans d\'expérience dans le développement de produits web, API et systèmes distribués. Expérience en Laravel, Vue.js et infrastructure Cloudflare. Basé en Algérie, travail à distance avec des équipes internationales.',
    education: [
      {
        institution: 'Université des Sciences et de la Technologie Houari Boumediene',
        degree: 'Licence en informatique',
        period: '2013 – 2017',
        location: 'Alger, Algérie',
      },
    ],
    certifications: [
      { name: 'Certification développeur Cloudflare', issuer: 'Cloudflare', year: '2024' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2022' },
    ],
    languages: [
      { language: 'Arabe', level: 'Langue maternelle' },
      { language: 'Anglais', level: 'Professionnel' },
      { language: 'Français', level: 'Professionnel' },
    ],
    cvFiles: { fr: '/cv/thabet-cv-fr.pdf', en: '/cv/thabet-cv-en.pdf', ar: '/cv/thabet-cv-ar.pdf' },
  },
};

export function getExperience(locale: Locale): Experience[] {
  return experience[locale];
}

export function getSkills(locale: Locale): SkillArea[] {
  return skills[locale];
}

export function getAbout(locale: Locale) {
  return about[locale];
}

export function getResume(locale: Locale): ResumeData {
  return resume[locale];
}

export function getProjectCollection(locale: Locale) {
  return `projects-${locale}` as const;
}

export function getArticleCollection(locale: Locale) {
  return `articles-${locale}` as const;
}
