#!/usr/bin/env node
/**
 * Generates localized project case-study markdown files from structured data.
 */
import { writeFileSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const locales = ['en', 'ar', 'fr'];
const base = '/workspace/content/projects';

const projects = [
  {
    slug: 'event-management',
    order: 1,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Redis', 'Zoom API', 'YouTube API', 'Payments'],
    en: {
      title: 'Advanced Event Management Platform',
      excerpt: 'End-to-end event lifecycle platform with registrations, scheduling, evaluations, payments, and live streaming.',
      problem: 'Organizations needed one system to run large events — from registration and agenda management to payments, evaluations, and live broadcasts — instead of disconnected tools.',
      solution: 'Built a Laravel + Vue.js platform covering the full event lifecycle with admin dashboards, participant workflows, dynamic scheduling, secure payments, and real-time Zoom/YouTube streaming integrations.',
      role: 'Backend & full-stack developer — architecture, APIs, integrations, and core business workflows.',
      result: 'A unified platform that reduced operational overhead and enabled teams to manage complex events from a single control panel.',
      context: 'The platform serves organizers, participants, and administrators with role-based access and automated notifications throughout each event stage.',
      highlights: '- Real-time streaming via Zoom and YouTube APIs\n- Dynamic scheduling with conflict-aware sessions\n- Registration, evaluation, and payment workflows\n- Administrative dashboards and external API integrations',
    },
    ar: {
      title: 'منصة إدارة فعاليات متقدمة',
      excerpt: 'منصة متكاملة لإدارة دورة حياة الفعالية: التسجيل، الجدولة، التقييم، المدفوعات، والبث المباشر.',
      problem: 'كانت المؤسسات تحتاج نظامًا واحدًا لإدارة الفعاليات الكبيرة — من التسجيل والجدولة إلى المدفوعات والتقييم والبث — بدل أدوات متفرقة.',
      solution: 'بناء منصة Laravel + Vue.js تغطي دورة حياة الفعالية كاملة: لوحات إدارية، سير عمل المشاركين، جدولة ديناميكية، مدفوعات آمنة، وتكامل بث مباشر عبر Zoom وYouTube.',
      role: 'مطوّر Backend وFull-stack — الهندسة، واجهات API، التكاملات، وسير العمل الأساسي.',
      result: 'منصة موحّدة خفّضت الجهد التشغيلي وأسست إدارة الفعاليات المعقدة من لوحة تحكم واحدة.',
      context: 'تخدم المنصة المنظمين والمشاركين والإداريين بصلاحيات حسب الدور وإشعارات آلية في كل مرحلة من مراحل الفعالية.',
      highlights: '- بث مباشر عبر Zoom وYouTube\n- جدولة ديناميكية مع إدارة تعارض الجلسات\n- سير عمل التسجيل والتقييم والدفع\n- لوحات إدارية وتكاملات API خارجية',
    },
    fr: {
      title: 'Plateforme avancée de gestion d\'événements',
      excerpt: 'Plateforme complète pour le cycle de vie des événements : inscriptions, planning, évaluations, paiements et streaming.',
      problem: 'Les organisations avaient besoin d\'un système unique pour gérer de grands événements — inscriptions, agenda, paiements, évaluations et diffusion — au lieu d\'outils dispersés.',
      solution: 'Construction d\'une plateforme Laravel + Vue.js couvrant tout le cycle : tableaux de bord, workflows participants, planning dynamique, paiements sécurisés et streaming Zoom/YouTube.',
      role: 'Développeur backend & full-stack — architecture, API, intégrations et workflows métier.',
      result: 'Une plateforme unifiée réduisant la charge opérationnelle et centralisant la gestion d\'événements complexes.',
      context: 'La plateforme sert organisateurs, participants et administrateurs avec des rôles distincts et des notifications automatisées.',
      highlights: '- Streaming en direct via Zoom et YouTube\n- Planning dynamique avec gestion des conflits\n- Workflows d\'inscription, évaluation et paiement\n- Tableaux de bord et intégrations API externes',
    },
  },
  {
    slug: 'webinar-management',
    order: 2,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'SMS APIs', 'Email', 'Meeting APIs'],
    en: {
      title: 'Webinar Management Platform',
      excerpt: 'Dedicated webinar lifecycle system with secure sessions, multilingual support, and automated communications.',
      problem: 'Teams running recurring webinars needed secure access control, reliable session delivery, and automated participant communication across languages.',
      solution: 'Developed a webinar management system with scheduling, secure session tokens, multilingual UI, SMS/email notifications, and integrations with online meeting services.',
      role: 'Full-stack developer — session security, notification pipelines, and admin workflows.',
      result: 'Streamlined webinar operations with automated communications and a consistent experience for hosts and attendees.',
      context: 'The system supports organizers from scheduling through post-session follow-up with audit-friendly participant records.',
      highlights: '- Secure session token generation\n- Multilingual participant experience\n- SMS and email notification automation\n- Integration with meeting/communication providers',
    },
    ar: {
      title: 'منصة إدارة الندوات الإلكترونية',
      excerpt: 'نظام متخصص لإدارة الندوات: جلسات آمنة، دعم متعدد اللغات، واتصالات آلية مع المشاركين.',
      problem: 'فرق الندوات المتكررة احتاجت تحكمًا آمنًا بالوصول، وتجربة جلسات موثوقة، وتواصلًا آلياً مع المشاركين بعدة لغات.',
      solution: 'تطوير نظام إدارة ندوات يشمل الجدولة، رموز جلسات آمنة، واجهة متعددة اللغات، إشعارات SMS/بريد، وتكامل خدمات الاجتماعات.',
      role: 'مطوّر Full-stack — أمان الجلسات، قنوات الإشعارات، وسير عمل الإدارة.',
      result: 'تبسيط تشغيل الندوات عبر اتصالات آلية وتجربة متسقة للمنظمين والحضور.',
      context: 'يدعم النظام المنظمين من الجدولة حتى المتابعة بعد الجلسة مع سجلات مشاركين قابلة للتدقيق.',
      highlights: '- توليد رموز جلسات آمنة\n- تجربة متعددة اللغات\n- أتمتة إشعارات SMS والبريد\n- تكامل مزودي الاجتماعات والاتصال',
    },
    fr: {
      title: 'Plateforme de gestion de webinaires',
      excerpt: 'Système dédié au cycle de vie des webinaires : sessions sécurisées, multilingue et communications automatisées.',
      problem: 'Les équipes organisant des webinaires récurrents avaient besoin d\'un contrôle d\'accès sécurisé et de communications automatisées multilingues.',
      solution: 'Développement d\'un système avec planification, jetons de session sécurisés, interface multilingue, notifications SMS/email et intégrations visioconférence.',
      role: 'Développeur full-stack — sécurité des sessions, notifications et workflows admin.',
      result: 'Opérations webinaire simplifiées avec communications automatisées et expérience cohérente.',
      context: 'Le système accompagne les organisateurs de la planification au suivi post-session.',
      highlights: '- Génération de jetons de session sécurisés\n- Expérience multilingue\n- Automatisation SMS et email\n- Intégration des services de visioconférence',
    },
  },
  {
    slug: 'consultation-platform',
    order: 3,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'Calendar Sync', 'Video APIs', 'MySQL'],
    en: {
      title: 'Consultation Management Platform',
      excerpt: 'Platform connecting clients and consultants through structured scheduling and secure video consultations.',
      problem: 'Consultation services required coordinated scheduling, consultant profiles, secure video sessions, and consistent client communication.',
      solution: 'Built a consultation platform with consultant management, calendar synchronization, appointment booking, secure video consultations, and automated client workflows.',
      role: 'Backend developer — scheduling logic, APIs, and consultation workflow design.',
      result: 'A reliable consultation experience with reduced manual coordination between clients, consultants, and administrators.',
      context: 'Administrative tools and APIs support both internal teams and integrated client-facing channels.',
      highlights: '- Consultant profiles and availability management\n- Calendar synchronization and booking rules\n- Secure video consultation sessions\n- Automated client notifications and status tracking',
    },
    ar: {
      title: 'منصة إدارة الاستشارات',
      excerpt: 'منصة تربط العملاء بالمستشارين عبر جدولة منظمة واستشارات فيديو آمنة.',
      problem: 'خدمات الاستشارة احتاجت تنسيقًا للمواعيد، ملفات للمستشارين، جلسات فيديو آمنة، وتواصلًا متسقًا مع العملاء.',
      solution: 'بناء منصة تشمل إدارة المستشارين، مزامنة التقويم، حجز المواعيد، استشارات فيديو آمنة، وسير عمل آلي للعملاء.',
      role: 'مطوّر Backend — منطق الجدولة، واجهات API، وتصميم سير عمل الاستشارات.',
      result: 'تجربة استشارية موثوقة مع تقليل التنسيق اليدوي بين العملاء والمستشارين والإدارة.',
      context: 'أدوات إدارية وواجهات API تدعم الفرق الداخلية والقنوات الموجهة للعملاء.',
      highlights: '- ملفات المستشارين وإدارة التوفر\n- مزامنة التقويم وقواعد الحجز\n- جلسات فيديو استشارية آمنة\n- إشعارات آلية وتتبع حالة الطلب',
    },
    fr: {
      title: 'Plateforme de gestion de consultations',
      excerpt: 'Plateforme reliant clients et consultants via planification structurée et consultations vidéo sécurisées.',
      problem: 'Les services de consultation nécessitaient une planification coordonnée, des profils consultants et des sessions vidéo sécurisées.',
      solution: 'Construction d\'une plateforme avec gestion des consultants, synchronisation calendrier, réservation, consultations vidéo et workflows clients automatisés.',
      role: 'Développeur backend — logique de planification, API et workflows de consultation.',
      result: 'Expérience de consultation fiable avec moins de coordination manuelle.',
      context: 'Outils admin et API pour équipes internes et canaux clients intégrés.',
      highlights: '- Profils consultants et disponibilités\n- Synchronisation calendrier et règles de réservation\n- Sessions vidéo sécurisées\n- Notifications et suivi de statut automatisés',
    },
  },
  {
    slug: 'elearning-platform',
    order: 4,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Redis', 'REST APIs'],
    en: {
      title: 'E-Learning Management Platform',
      excerpt: 'Comprehensive LMS for courses, learning paths, enrollments, assessments, and subscription-based access.',
      problem: 'Educational providers needed a scalable system for courses, student progress, teacher dashboards, and subscription management in one place.',
      solution: 'Developed an e-learning platform with course management, learning paths, enrollments, progress tracking, assessments, subscriptions, and role-based dashboards.',
      role: 'Full-stack developer — LMS architecture, enrollment logic, and REST API services.',
      result: 'A structured learning environment supporting students, teachers, and administrators with clear progress visibility.',
      context: 'The platform handles structured learning workflows and exposes backend services for integrated client applications.',
      highlights: '- Course and learning path management\n- Enrollment and progress tracking\n- Assessments and evaluations\n- Subscription logic and multi-role dashboards',
    },
    ar: {
      title: 'منصة التعلم الإلكتروني',
      excerpt: 'نظام تعليمي متكامل للدورات ومسارات التعلم والتسجيل والتقييمات والاشتراكات.',
      problem: 'مقدمو التعليم احتاجوا نظامًا قابلًا للتوسع لإدارة الدورات وتقدم الطلاب ولوحات المعلمين والاشتراكات في مكان واحد.',
      solution: 'تطوير منصة تعليم إلكتروني تشمل إدارة الدورات ومسارات التعلم والتسجيل وتتبع التقدم والتقييمات والاشتراكات ولوحات حسب الأدوار.',
      role: 'مطوّر Full-stack — هندسة LMS، منطق التسجيل، وخدمات REST API.',
      result: 'بيئة تعلم منظمة تدعم الطلاب والمعلمين والإداريين مع رؤية واضحة للتقدم.',
      context: 'تدير المنصة سير تعلم منظمًا وتوفّر خدمات خلفية لتطبيقات العملاء المتكاملة.',
      highlights: '- إدارة الدورات ومسارات التعلم\n- التسجيل وتتبع التقدم\n- التقييمات والاختبارات\n- منطق الاشتراكات ولوحات متعددة الأدوار',
    },
    fr: {
      title: 'Plateforme e-learning',
      excerpt: 'LMS complet pour cours, parcours, inscriptions, évaluations et accès par abonnement.',
      problem: 'Les organismes de formation avaient besoin d\'un système évolutif pour cours, progression, enseignants et abonnements.',
      solution: 'Développement d\'une plateforme avec gestion des cours, parcours, inscriptions, suivi, évaluations, abonnements et tableaux de bord par rôle.',
      role: 'Développeur full-stack — architecture LMS, logique d\'inscription et API REST.',
      result: 'Environnement d\'apprentissage structuré avec visibilité claire de la progression.',
      context: 'La plateforme gère des workflows d\'apprentissage et expose des services backend intégrables.',
      highlights: '- Gestion des cours et parcours\n- Inscription et suivi de progression\n- Évaluations et tests\n- Abonnements et tableaux de bord multi-rôles',
    },
  },
  {
    slug: 'grant-management',
    order: 5,
    company: 'TechTrans',
    technologies: ['Laravel', 'SAP Integration', 'MySQL', 'Digital Signatures', 'Workflows'],
    en: {
      title: 'Grant Management & Funding Platform',
      excerpt: 'Enterprise grant platform with SAP integration, financial workflows, contracts, and digital approvals.',
      problem: 'Grant programs required strict financial controls, SAP-aligned processes, contract management, and multi-step approvals that paper workflows could not support.',
      solution: 'Contributed to an enterprise grant management platform integrating with SAP for budgets, contracts, workflows, digital signatures, and financial approval chains.',
      role: 'Backend developer — SAP integration, workflow engine, and financial process automation.',
      result: 'Digitized grant operations with traceable approvals and tighter alignment between administrative and financial systems.',
      context: 'The platform supports complex grant application lifecycles with administrative dashboards and third-party integrations.',
      highlights: '- Grant application and budget management\n- SAP integration for financial data sync\n- Contract and approval workflow engine\n- Digital signatures and audit trails',
    },
    ar: {
      title: 'منصة إدارة المنح والتمويل',
      excerpt: 'منصة مؤسسية للمنح مع تكامل SAP وسير عمل مالي وعقود وموافقات رقمية.',
      problem: 'برامج المنح احتاجت ضوابط مالية صارمة وعمليات متوافقة مع SAP وإدارة عقود وموافقات متعددة المراحل.',
      solution: 'المساهمة في منصة مؤسسية للمنح تتكامل مع SAP للميزانيات والعقود وسير العمل والتوقيع الرقمي وسلاسل الموافقة المالية.',
      role: 'مطوّر Backend — تكامل SAP، محرك سير العمل، وأتمتة العمليات المالية.',
      result: 'رقمنة عمليات المنح مع موافقات قابلة للتتبع ومواءمة أوثق بين الأنظمة الإدارية والمالية.',
      context: 'تدعم المنصة دورة حياة طلبات المنح المعقدة مع لوحات إدارية وتكاملات خارجية.',
      highlights: '- إدارة طلبات المنح والميزانيات\n- تكامل SAP لمزامنة البيانات المالية\n- محرك عقود وموافقات\n- توقيع رقمي وسجلات تدقيق',
    },
    fr: {
      title: 'Plateforme de gestion des subventions',
      excerpt: 'Plateforme d\'entreprise pour subventions avec intégration SAP, workflows financiers et signatures numériques.',
      problem: 'Les programmes de subventions exigeaient des contrôles financiers stricts, des processus SAP et des approbations multi-étapes.',
      solution: 'Contribution à une plateforme intégrant SAP pour budgets, contrats, workflows, signatures numériques et chaînes d\'approbation.',
      role: 'Développeur backend — intégration SAP, moteur de workflow et automatisation financière.',
      result: 'Opérations de subventions numérisées avec approbations traçables et alignement SAP.',
      context: 'La plateforme gère des cycles de demande complexes avec tableaux de bord et intégrations tierces.',
      highlights: '- Gestion des demandes et budgets\n- Intégration SAP\n- Moteur de contrats et approbations\n- Signatures numériques et audit',
    },
  },
  {
    slug: 'membership-platform',
    order: 6,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'CRM Integration', 'MySQL', 'Subscriptions'],
    en: {
      title: 'Membership Management Platform',
      excerpt: 'Subscription-based membership system with digital cards, CRM integration, and automated member workflows.',
      problem: 'Membership organizations needed digital subscription services, CRM-connected member records, and automated renewal workflows.',
      solution: 'Developed a membership platform covering registration, subscription management, digital membership cards, CRM integration, and automated member communications.',
      role: 'Full-stack developer — subscription logic, CRM integration, and member lifecycle automation.',
      result: 'Improved member onboarding and retention through automated workflows and integrated CRM data.',
      context: 'Administrative dashboards support membership teams with subscription-related business rules and reporting.',
      highlights: '- Membership registration and renewals\n- Digital membership card generation\n- CRM integration and data sync\n- Automated member workflow rules',
    },
    ar: {
      title: 'منصة إدارة العضويات',
      excerpt: 'نظام عضويات قائم على الاشتراكات مع بطاقات رقمية وتكامل CRM وسير عمل آلي.',
      problem: 'منظمات العضويات احتاجت خدمات اشتراك رقمية وسجلات أعضاء مرتبطة بـ CRM وتجديدًا آليًا.',
      solution: 'تطوير منصة عضويات تشمل التسجيل وإدارة الاشتراكات وبطاقات العضوية الرقمية وتكامل CRM واتصالات آلية مع الأعضاء.',
      role: 'مطوّر Full-stack — منطق الاشتراكات، تكامل CRM، وأتمتة دورة حياة العضو.',
      result: 'تحسين انضمام الأعضاء والاحتفاظ بهم عبر سير عمل آلي وبيانات CRM متكاملة.',
      context: 'لوحات إدارية تدعم فرق العضويات بقواعد اشتراك وتقارير تشغيلية.',
      highlights: '- تسجيل العضويات والتجديد\n- إصدار بطاقات عضوية رقمية\n- تكامل CRM ومزامنة البيانات\n- قواعد سير عمل آلية للأعضاء',
    },
    fr: {
      title: 'Plateforme de gestion des adhésions',
      excerpt: 'Système d\'adhésion par abonnement avec cartes numériques, intégration CRM et workflows automatisés.',
      problem: 'Les organisations membres avaient besoin de services d\'abonnement numériques et de données CRM synchronisées.',
      solution: 'Développement d\'une plateforme couvrant inscription, abonnements, cartes numériques, intégration CRM et communications automatisées.',
      role: 'Développeur full-stack — logique d\'abonnement, intégration CRM et automatisation.',
      result: 'Meilleure acquisition et rétention des membres grâce aux workflows automatisés.',
      context: 'Tableaux de bord pour équipes adhésion avec règles métier et reporting.',
      highlights: '- Inscription et renouvellements\n- Cartes d\'adhésion numériques\n- Intégration CRM\n- Workflows membres automatisés',
    },
  },
  {
    slug: 'driving-school-system',
    order: 7,
    company: 'TechTrans',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Payments', 'Scheduling'],
    en: {
      title: 'Driving School Management System',
      excerpt: 'Operational system covering trainee registration, lessons, exams, invoicing, and online payments.',
      problem: 'Driving schools managed trainees, lessons, attendance, exams, and billing through manual processes that caused scheduling conflicts and payment delays.',
      solution: 'Contributed to a complete driving school system with trainee registration, lesson scheduling, attendance tracking, exam management, invoicing, and online payments.',
      role: 'Backend developer — scheduling engine, billing workflows, and payment integration.',
      result: 'More reliable day-to-day operations with clearer visibility into trainee progress and financial records.',
      context: 'Administrative workflows and reporting support school staff across training, examination, and billing stages.',
      highlights: '- Trainee registration and lesson scheduling\n- Attendance and examination tracking\n- Invoicing and online payment integration\n- Administrative reporting dashboards',
    },
    ar: {
      title: 'نظام إدارة مدارس القيادة',
      excerpt: 'نظام تشغيلي يغطي تسجيل المتدربين والدروس والامتحانات والفوترة والمدفوعات الإلكترونية.',
      problem: 'مدارس القيادة كانت تدير المتدربين والدروس والحضور والامتحانات والفوترة يدويًا مما يسبب تعارضات وجدولة ومتأخرات في الدفع.',
      solution: 'المساهمة في نظام متكامل يشمل تسجيل المتدربين وجدولة الدروس وتتبع الحضور وإدارة الامتحانات والفوترة والمدفوعات الإلكترونية.',
      role: 'مطوّر Backend — محرك الجدولة، سير الفوترة، وتكامل الدفع.',
      result: 'تشغيل يومي أكثر موثوقية مع رؤية أوضح لتقدم المتدربين والسجلات المالية.',
      context: 'سير عمل إداري وتقارير تدعم طاقم المدرسة في التدريب والامتحانات والفوترة.',
      highlights: '- تسجيل المتدربين وجدولة الدروس\n- تتبع الحضور والامتحانات\n- فوترة وتكامل مدفوعات إلكترونية\n- لوحات تقارير إدارية',
    },
    fr: {
      title: 'Système de gestion d\'auto-école',
      excerpt: 'Système opérationnel : inscription stagiaires, leçons, examens, facturation et paiements en ligne.',
      problem: 'Les auto-écoles géraient manuellement stagiaires, leçons, présence, examens et facturation.',
      solution: 'Contribution à un système complet : inscription, planification, présence, examens, facturation et paiements en ligne.',
      role: 'Développeur backend — planification, facturation et intégration paiement.',
      result: 'Opérations quotidiennes plus fiables avec visibilité sur la progression et les finances.',
      context: 'Workflows admin et rapports pour le personnel à chaque étape.',
      highlights: '- Inscription et planification des leçons\n- Suivi présence et examens\n- Facturation et paiements en ligne\n- Tableaux de bord de reporting',
    },
  },
  {
    slug: 'parcel-distribution',
    order: 8,
    company: 'TechTrans',
    technologies: ['Laravel', 'MySQL', 'Redis', 'Queues', 'REST APIs', 'GPS/Tracking'],
    en: {
      title: 'Advanced Parcel Distribution & Shipping System',
      excerpt: 'Laravel-based logistics platform for parcel routing, shipment tracking, and distribution operations.',
      problem: 'Distribution teams needed real-time parcel tracking, optimized routing workflows, and reliable backend services to coordinate shipping operations at scale.',
      solution: 'Built an advanced parcel distribution system on Laravel with shipment lifecycle management, routing logic, tracking integrations, background jobs, and operational APIs.',
      role: 'Lead backend developer — system architecture, shipment workflows, queues, and API design.',
      result: 'Improved shipment visibility and operational coordination across distribution teams and integrated services.',
      context: 'The system supports high-volume parcel flows with administrative tools and third-party logistics integrations.',
      highlights: '- End-to-end shipment lifecycle management\n- Routing and distribution workflow engine\n- Background jobs for notifications and sync\n- REST APIs for operational and external integrations',
    },
    ar: {
      title: 'نظام توزيع وشحن الطرود المتقدم',
      excerpt: 'منصة لوجستية مبنية على Laravel لتوجيه الطرود وتتبع الشحنات وعمليات التوزيع.',
      problem: 'فرق التوزيع احتاجت تتبعًا لحظيًا للطرود وسير عمل توجيه موثوقًا وخدمات خلفية لتنسيق عمليات الشحن على نطاق واسع.',
      solution: 'بناء نظام توزيع طرود متقدم على Laravel يشمل إدارة دورة حياة الشحنة ومنطق التوجيه وتكاملات التتبع ومهام خلفية وواجهات API تشغيلية.',
      role: 'مطوّر Backend رئيسي — هندسة النظام، سير الشحن، الطوابير، وتصميم API.',
      result: 'تحسين رؤية الشحنات وتنسيق العمليات بين فرق التوزيع والخدمات المتكاملة.',
      context: 'يدعم النظام تدفقات طرود عالية الحجم مع أدوات إدارية وتكاملات لوجستية خارجية.',
      highlights: '- إدارة دورة حياة الشحنة كاملة\n- محرك توجيه وتوزيع\n- مهام خلفية للإشعارات والمزامنة\n- REST APIs للتكامل التشغيلي والخارجي',
    },
    fr: {
      title: 'Système avancé de distribution de colis',
      excerpt: 'Plateforme logistique Laravel pour routage, suivi d\'expéditions et opérations de distribution.',
      problem: 'Les équipes de distribution avaient besoin de suivi en temps réel et de workflows de routage fiables à grande échelle.',
      solution: 'Construction d\'un système Laravel avec cycle de vie des expéditions, routage, suivi, jobs en arrière-plan et API opérationnelles.',
      role: 'Développeur backend principal — architecture, workflows d\'expédition et API.',
      result: 'Meilleure visibilité des expéditions et coordination opérationnelle.',
      context: 'Le système gère des flux de colis à haut volume avec outils admin et intégrations logistiques.',
      highlights: '- Cycle de vie complet des expéditions\n- Moteur de routage et distribution\n- Jobs pour notifications et sync\n- API REST opérationnelles et externes',
    },
  },
  {
    slug: 'pos-desktop',
    order: 9,
    company: 'TechTrans',
    technologies: ['Tauri', 'React', 'SyncPower', 'Desktop App', 'Offline-first'],
    en: {
      title: 'Desktop POS Application',
      excerpt: 'Cross-platform point-of-sale app built with Tauri, React, and SyncPower for retail operations.',
      problem: 'Retail points needed a fast, reliable POS that works on desktop with responsive UI and stable local/offline-capable operations.',
      solution: 'Developed a desktop POS application using Tauri + React with SyncPower integration, focused on checkout speed, inventory interaction, and a maintainable component architecture.',
      role: 'Full-stack/desktop developer — UI architecture, Tauri integration, and POS workflow implementation.',
      result: 'A lightweight desktop POS experience with modern UI patterns and reliable day-to-day retail operations.',
      context: 'The application is designed for cashier workflows with performance-sensitive interactions and clear operational states.',
      highlights: '- Tauri + React cross-platform desktop shell\n- SyncPower integration for POS operations\n- Component-based UI with responsive checkout flows\n- Structured state management for retail transactions',
    },
    ar: {
      title: 'تطبيق نقاط بيع لسطح المكتب (POS)',
      excerpt: 'تطبيق نقاط بيع متعدد المنصات باستخدام Tauri وReact وSyncPower لعمليات البيع بالتجزئة.',
      problem: 'نقاط البيع احتاجت نظامًا سريعًا وموثوقًا على سطح المكتب بواجهة سلسة وعمليات محلية مستقرة.',
      solution: 'تطوير تطبيق POS لسطح المكتب باستخدام Tauri + React مع تكامل SyncPower، مع التركيز على سرعة الدفع وتفاعل المخزون وهندسة مكوّنات قابلة للصيانة.',
      role: 'مطوّر Full-stack/Desktop — هندسة الواجهة، تكامل Tauri، وتنفيذ سير عمل نقاط البيع.',
      result: 'تجربة POS خفيفة على سطح المكتب بواجهة حديثة وتشغيل يومي موثوق لنقاط البيع.',
      context: 'التطبيق مصمم لسير عمل الكاشير مع تفاعلات حساسة للأداء وحالات تشغيل واضحة.',
      highlights: '- واجهة Tauri + React لسطح المكتب\n- تكامل SyncPower لعمليات POS\n- واجهة مكوّنة مع تدفقات دفع سريعة\n- إدارة حالة منظمة لمعاملات البيع',
    },
    fr: {
      title: 'Application POS desktop',
      excerpt: 'Application de point de vente multiplateforme avec Tauri, React et SyncPower.',
      problem: 'Les points de vente avaient besoin d\'un POS rapide et fiable sur desktop avec une UI réactive.',
      solution: 'Développement d\'une application POS desktop Tauri + React avec intégration SyncPower, axée sur la rapidité de caisse et l\'architecture composants.',
      role: 'Développeur full-stack/desktop — UI, intégration Tauri et workflows POS.',
      result: 'Expérience POS desktop légère avec UI moderne et opérations fiables.',
      context: 'Conçue pour les workflows caissiers avec interactions performantes.',
      highlights: '- Shell desktop Tauri + React\n- Intégration SyncPower\n- UI composants et flux de caisse\n- Gestion d\'état structurée des transactions',
    },
  },
  {
    slug: 'colon-health-app',
    order: 10,
    company: 'TechTrans',
    technologies: ['Expo', 'React Native', 'TypeScript', 'Health Tracking', 'Mobile'],
    en: {
      title: 'Colon Health Mobile App',
      excerpt: 'Expo-based Android health application focused on colon wellness tracking and user guidance.',
      problem: 'Users needed an accessible mobile app to track colon health indicators and follow structured wellness guidance with a smooth Android experience.',
      solution: 'Built a colon health application using Expo/React Native with health tracking flows, educational content presentation, and mobile-optimized UX patterns.',
      role: 'Mobile developer — app architecture, health tracking screens, and Expo deployment workflow.',
      result: 'A focused health app delivering structured tracking and guidance in a clean mobile interface.',
      context: 'The app emphasizes clarity, guided flows, and maintainable screen architecture for future health feature expansion.',
      highlights: '- Expo/React Native Android application\n- Health tracking and guided user flows\n- Component-based mobile UI architecture\n- Structured data presentation for wellness insights',
    },
    ar: {
      title: 'تطبيق صحة القولون للأندرويد',
      excerpt: 'تطبيق صحي للأندرويد مبني بـ Expo يركز على تتبع صحة القولون وإرشاد المستخدم.',
      problem: 'المستخدمون احتاجوا تطبيقًا سهل الاستخدام لتتبع مؤشرات صحة القولون واتباع إرشادات منظمة بتجربة أندرويد سلسة.',
      solution: 'بناء تطبيق صحة القولون باستخدام Expo/React Native مع تدفقات تتبع صحي وعرض محتوى تعليمي وأنماط تجربة مستخدم محسّنة للموبايل.',
      role: 'مطوّر موبايل — هندسة التطبيق، شاشات التتبع الصحي، وسير نشر Expo.',
      result: 'تطبيق صحي مركّز يقدم تتبعًا منظمًا وإرشادًا بواجهة موبايل واضحة.',
      context: 'يركز التطبيق على الوضوح والتدفقات الموجّهة وهندسة شاشات قابلة للتوسع مستقبلًا.',
      highlights: '- تطبيق Expo/React Native للأندرويد\n- تتبع صحي وتدفقات إرشاد للمستخدم\n- هندسة واجهة موبايل مكوّنة\n- عرض بيانات منظم لرؤى الصحة',
    },
    fr: {
      title: 'Application mobile santé du côlon',
      excerpt: 'Application Android Expo pour le suivi de la santé du côlon et l\'accompagnement utilisateur.',
      problem: 'Les utilisateurs avaient besoin d\'une app mobile accessible pour suivre des indicateurs de santé du côlon.',
      solution: 'Construction d\'une application Expo/React Native avec suivi santé, contenu éducatif et UX mobile optimisée.',
      role: 'Développeur mobile — architecture app, écrans de suivi et workflow Expo.',
      result: 'Application santé focalisée avec suivi structuré et interface mobile claire.',
      context: 'L\'app privilégie la clarté, les parcours guidés et une architecture évolutive.',
      highlights: '- Application Expo/React Native Android\n- Suivi santé et parcours guidés\n- Architecture UI mobile composants\n- Présentation structurée des données santé',
    },
  },
  {
    slug: 'vtc-rental',
    order: 11,
    company: 'Tawfiq Company',
    technologies: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'GPS Tracking'],
    en: {
      title: 'VTC Car Rental Management System',
      excerpt: 'Vehicle rental and transportation platform with booking, fleet ops, pricing, and real-time tracking.',
      problem: 'A transportation company needed unified control over fleet availability, driver scheduling, pricing rules, and live vehicle tracking.',
      solution: 'Contributed to a VTC rental management platform with vehicle/fleet modules, booking workflows, driver scheduling, automated pricing, and real-time tracking.',
      role: 'Laravel & mobile developer — backend APIs, booking logic, and tracking integrations.',
      result: 'More efficient fleet utilization and clearer operational visibility for dispatch and administrative teams.',
      context: 'Administrative dashboards support daily rental operations, driver coordination, and reporting.',
      highlights: '- Fleet and vehicle management\n- Booking and driver scheduling workflows\n- Automated pricing rules\n- Real-time tracking and admin reporting',
    },
    ar: {
      title: 'نظام إدارة تأجير المركبات (VTC)',
      excerpt: 'منصة تأجير ونقل تشمل الحجز وإدارة الأسطول والتسعير والتتبع المباشر.',
      problem: 'شركة النقل احتاجت تحكمًا موحدًا في توفر الأسطول وجدولة السائقين وقواعد التسعير وتتبع المركبات لحظيًا.',
      solution: 'المساهمة في منصة VTC تشمل إدارة المركبات والأسطول وسير حجز وجدولة السائقين وتسعير آلي وتتبع مباشر.',
      role: 'مطوّر Laravel وموبايل — واجهات API، منطق الحجز، وتكاملات التتبع.',
      result: 'استغلال أفضل للأسطول ورؤية تشغيلية أوضح لفرق الإرسال والإدارة.',
      context: 'لوحات إدارية تدعم عمليات التأجير اليومية وتنسيق السائقين والتقارير.',
      highlights: '- إدارة المركبات والأسطول\n- سير عمل الحجز وجدولة السائقين\n- قواعد تسعير آلية\n- تتبع مباشر وتقارير إدارية',
    },
    fr: {
      title: 'Système de location VTC',
      excerpt: 'Plateforme de location et transport : réservation, flotte, tarification et suivi en temps réel.',
      problem: 'Une entreprise de transport avait besoin d\'un contrôle unifié de la flotte, des chauffeurs, des tarifs et du suivi GPS.',
      solution: 'Contribution à une plateforme VTC avec gestion de flotte, réservations, planification chauffeurs, tarification automatisée et suivi temps réel.',
      role: 'Développeur Laravel & mobile — API, logique de réservation et suivi.',
      result: 'Meilleure utilisation de la flotte et visibilité opérationnelle pour les équipes.',
      context: 'Tableaux de bord pour opérations quotidiennes et coordination des chauffeurs.',
      highlights: '- Gestion véhicules et flotte\n- Réservation et planification chauffeurs\n- Tarification automatisée\n- Suivi temps réel et reporting',
    },
  },
];

function renderProject(locale, project) {
  const data = project[locale];
  const yaml = `---
title: ${JSON.stringify(data.title)}
excerpt: ${JSON.stringify(data.excerpt)}
problem: ${JSON.stringify(data.problem)}
solution: ${JSON.stringify(data.solution)}
role: ${JSON.stringify(data.role)}
result: ${JSON.stringify(data.result)}
technologies:
${project.technologies.map((t) => `  - ${t}`).join('\n')}
cover: /images/projects/placeholder.svg
order: ${project.order}
featured: true
company: ${JSON.stringify(project.company)}
translationOf: ${project.slug}
---

## ${locale === 'ar' ? 'السياق' : locale === 'fr' ? 'Contexte' : 'Context'}

${data.context}

## ${locale === 'ar' ? 'أبرز الجوانب التقنية' : locale === 'fr' ? 'Points techniques clés' : 'Technical highlights'}

${data.highlights}
`;
  return yaml;
}

// Remove old placeholder projects
for (const locale of locales) {
  const dir = join(base, locale);
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.md')) unlinkSync(join(dir, file));
  }
}

for (const locale of locales) {
  const dir = join(base, locale);
  mkdirSync(dir, { recursive: true });
  for (const project of projects) {
    const path = join(dir, `${project.slug}.md`);
    writeFileSync(path, renderProject(locale, project), 'utf8');
  }
}

console.log(`Generated ${projects.length * locales.length} project files.`);
