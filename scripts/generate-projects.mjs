#!/usr/bin/env node
/**
 * Generates localized portfolio case studies (enterprise + freelance).
 * No company names, generic scope labels only — no technical stack names.
 */
import { writeFileSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { enterpriseProjects } from './project-data-enterprise.mjs';

const locales = ['en', 'ar', 'fr'];
const base = '/workspace/content/projects';

const freelancerProjects = [
  {
    slug: 'parcel-distribution',
    order: 8,
    categories: {
      en: ['Integrated Web System', 'Logistics Operations', 'Real-time Tracking', 'Admin Dashboards', 'External Integrations'],
      ar: ['نظام ويب متكامل', 'عمليات لوجستية', 'تتبع لحظي', 'لوحات إدارة', 'تكاملات خارجية'],
      fr: ['Système web intégré', 'Opérations logistiques', 'Suivi en temps réel', 'Tableaux de bord', 'Intégrations externes'],
    },
    en: {
      title: 'Parcel Distribution & Shipping Platform',
      excerpt: 'An advanced logistics platform that connects warehouse operations, dispatch teams, and customers through one reliable shipping workflow.',
      problem: 'The operation relied on fragmented tools: spreadsheets for routing, phone calls for status updates, and manual handoffs between warehouse and delivery teams. Delays were hard to trace, customers lacked visibility, and managers could not see bottlenecks until problems escalated.',
      solution: 'I designed and built a centralized distribution system that manages the full shipment lifecycle — from intake and sorting to routing, handoff, delivery confirmation, and exception handling. The platform gives each role a clear view of what needs to happen next, with automated notifications and operational dashboards.',
      role: 'Independent developer — product analysis, system architecture, backend development, admin interfaces, and production support.',
      result: 'Teams gained end-to-end visibility over parcel flows, faster coordination between departments, and a scalable foundation for growing shipment volume without losing control.',
      body: `### What the platform delivers

A single operational hub where warehouse staff, dispatchers, and administrators work from the same source of truth. Every parcel has a traceable journey with status history, responsible parties, and timestamps.

### Core capabilities

- **Shipment lifecycle management** — create, assign, route, deliver, and close shipments with structured workflows
- **Distribution routing** — rules-based routing and handoffs between hubs, drivers, and delivery points
- **Live tracking** — operational visibility for teams and status updates across the delivery chain
- **Exception handling** — delayed, returned, or failed deliveries captured with reasons and follow-up actions
- **Admin & reporting** — dashboards for daily volume, performance trends, and operational bottlenecks
- **Integration-ready APIs** — connect external partners, notification services, and future mobile channels

### Why it works

The system was built for real operational pressure: high daily volume, multiple handoffs, and teams that need clarity more than complexity. The architecture prioritizes reliability, auditability, and maintainability so the platform can evolve as logistics requirements grow.`,
    },
    ar: {
      title: 'منصة توزيع وشحن الطرود',
      excerpt: 'منصة لوجستية متقدمة تربط المستودع وفرق التوزيع والعملاء في سير عمل شحن واحد موثوق.',
      problem: 'كان التشغيل يعتمد على أدوات متفرقة: جداول للتوجيه، اتصالات هاتفية لمعرفة الحالة، وتسليم يدوي بين المستودع وفرق التوصيل. صعوبة تتبع التأخير، غياب وضوح للعميل، وعدم رؤية الإدارة للاختناقات إلا بعد تفاقم المشكلة.',
      solution: 'صممت وبنيت نظام توزيع مركزي يدير دورة حياة الشحنة كاملة — من الاستلام والفرز إلى التوجيه والتسليم وتأكيد التسليم ومعالجة الاستثناءات. المنصة تمنح كل دور رؤية واضحة لما يجب تنفيذه تاليًا، مع إشعارات آلية ولوحات تشغيلية.',
      role: 'مطوّر مستقل — تحليل المنتج، هندسة النظام، تطوير الخلفية، واجهات الإدارة، ودعم الإنتاج.',
      result: 'حصلت الفرق على رؤية شاملة لتدفق الطرود، وتنسيق أسرع بين الأقسام، وأساس قابل للتوسع مع نمو حجم الشحن دون فقدان السيطرة.',
      body: `### ماذا تقدّم المنصة

مركز تشغيل واحد يعمل منه موظفو المستودع وموزّعو الشحن والإدارة من نفس مصدر موثوق. لكل طرد مسار قابل للتتبع مع سجل حالات والجهة المسؤولة والتوقيت.

### القدرات الأساسية

- **إدارة دورة حياة الشحنة** — إنشاء، إسناد، توجيه، تسليم، وإغلاق الشحنات بسير عمل منظم
- **توجيه التوزيع** — قواعد توجيه وتسليم بين المراكز والسائقين ونقاط التسليم
- **تتبع لحظي** — رؤية تشغيلية للفرق وتحديثات حالة عبر سلسلة التوصيل
- **معالجة الاستثناءات** — تأخير، إرجاع، أو فشل التسليم مع الأسباب وإجراءات المتابعة
- **إدارة وتقارير** — لوحات لحجم العمل اليومي واتجاهات الأداء ونقاط الاختناق
- **واجهات جاهزة للتكامل** — ربط شركاء خارجيين وخدمات إشعار وقنوات مستقبلية

### لماذا ينجح النظام

بُني لضغط تشغيلي حقيقي: حجم يومي مرتفع، تسليمات متعددة، وفرق تحتاج وضوحًا أكثر من تعقيد. الأولوية للموثوقية وقابلية التدقيق والصيانة حتى تتطور المنصة مع متطلبات اللوجستيات.`,
    },
    fr: {
      title: 'Plateforme de distribution et expédition de colis',
      excerpt: 'Plateforme logistique avancée reliant entrepôt, équipes de distribution et clients dans un flux d\'expédition fiable.',
      problem: 'L\'exploitation reposait sur des outils dispersés : tableurs, appels téléphoniques et transferts manuels. Retards difficiles à tracer, peu de visibilité client, et gestion réactive des problèmes.',
      solution: 'Conception et développement d\'un système centralisé gérant tout le cycle d\'expédition — réception, tri, routage, livraison, confirmation et exceptions — avec notifications et tableaux de bord opérationnels.',
      role: 'Développeur indépendant — analyse produit, architecture, backend, interfaces admin et support production.',
      result: 'Visibilité de bout en bout, coordination plus rapide et base évolutive pour un volume croissant.',
      body: `### Ce que la plateforme apporte

Un hub opérationnel unique pour entrepôt, dispatchers et administration. Chaque colis a un parcours traçable avec historique, responsables et horodatage.

### Capacités clés

- **Cycle de vie des expéditions** — création, affectation, routage, livraison et clôture
- **Routage de distribution** — règles de transfert entre hubs, chauffeurs et points de livraison
- **Suivi en temps réel** — visibilité opérationnelle sur toute la chaîne
- **Gestion des exceptions** — retards, retours et échecs avec motifs et suivi
- **Administration & reporting** — volumes, tendances et goulots d\'étranglement
- **API d\'intégration** — partenaires externes et services de notification

### Pourquoi ça fonctionne

Conçu pour la pression opérationnelle réelle : volume élevé, multiples transferts, et besoin de clarté. Fiabilité, traçabilité et maintenabilité au cœur du système.`,
    },
  },
  {
    slug: 'pos-desktop',
    order: 9,
    categories: {
      en: ['Desktop Application', 'Retail Operations', 'Fast Checkout', 'Inventory Interaction', 'Offline-capable UX'],
      ar: ['تطبيق سطح مكتب', 'عمليات التجزئة', 'دفع سريع', 'تفاعل المخزون', 'تجربة مستقرة'],
      fr: ['Application desktop', 'Opérations retail', 'Caisse rapide', 'Gestion stock', 'UX stable'],
    },
    en: {
      title: 'Desktop Point-of-Sale (POS) Application',
      excerpt: 'A fast, reliable desktop POS built for daily retail operations — checkout, inventory interaction, and a smooth cashier experience.',
      problem: 'Retail points needed a POS that responds instantly during peak hours, handles frequent transactions without friction, and stays stable on desktop hardware used all day by cashiers.',
      solution: 'I built a cross-platform desktop POS with a modern interface focused on speed, clarity, and operational reliability. The application streamlines checkout flows, inventory lookups, and transaction handling for real retail environments.',
      role: 'Independent developer — application architecture, desktop UI, POS workflows, and hardware-oriented performance tuning.',
      result: 'Cashiers work faster with fewer errors, managers get clearer daily operations, and the POS remains maintainable for future retail feature expansion.',
      body: `### Built for the counter, not the slide deck

This POS was designed around the rhythm of a busy shop floor: quick product lookup, minimal clicks to complete a sale, and interface states that make the next action obvious.

### Key experience pillars

- **Speed at checkout** — optimized flows for high-frequency transactions during rush periods
- **Clear operational states** — cashiers always know whether a sale is in progress, completed, or needs attention
- **Inventory interaction** — fast access to stock information without breaking the sales flow
- **Desktop reliability** — stable performance on machines that run all day, every day
- **Maintainable structure** — modular screens and logic so new retail rules can be added safely

### Business impact

The product reduces friction at the point of sale — where every second matters. It gives small and mid-size retail operations a professional tool that feels modern without sacrificing dependability.`,
    },
    ar: {
      title: 'تطبيق نقاط البيع لسطح المكتب (POS)',
      excerpt: 'نظام نقاط بيع سريع وموثوق لعمليات التجزئة اليومية — الدفع، التعامل مع المخزون، وتجربة سلسة للكاشير.',
      problem: 'نقاط البيع احتاجت نظامًا يستجيب فورًا في أوقات الذروة، يتعامل مع معاملات متكررة بسلاسة، ويبقى مستقرًا على أجهزة سطح المكتب طوال اليوم.',
      solution: 'بنيت تطبيق نقاط بيع لسطح المكتب بواجهة حديثة تركّز على السرعة والوضوح والموثوقية. التطبيق يبسّط تدفقات الدفع والبحث في المخزون ومعالجة المعاملات في بيئة بيع حقيقية.',
      role: 'مطوّر مستقل — هندسة التطبيق، واجهة سطح المكتب، سير عمل نقاط البيع، وضبط الأداء.',
      result: 'كاشير أسرع بأخطاء أقل، إدارة أوضح للعمليات اليومية، وتطبيق قابل للتوسع بميزات تجزئة مستقبلية.',
      body: `### صُمم لطابور الدفع، لا للعروض التقديمية

ركّزت التجربة على إيقاع المحل المزدحم: بحث سريع عن المنتج، أقل عدد ممكن من الخطوات لإتمام البيع، وحالات واضحة للخطوة التالية.

### أعمدة التجربة

- **سرعة عند الدفع** — تدفقات محسّنة للمعاملات المتكررة في أوقات الذروة
- **حالات تشغيل واضحة** — الكاشير يعرف دائمًا: بيع جاري، مكتمل، أو يحتاج تدخلًا
- **تفاعل مع المخزون** — الوصول لمعلومات المخزون دون قطع سير البيع
- **موثوقية على سطح المكتب** — أداء مستقر على أجهزة تعمل طوال اليوم
- **هيكل قابل للصيانة** — شاشات ومنطق معياري لإضافة قواعد بيع جديدة بأمان

### الأثر العملي

يقلّل الاحتكاك عند نقطة البيع — حيث كل ثانية مهمة. يمنح محلات التجزئة أداة احترافية حديثة دون التضحية بالاستقرار.`,
    },
    fr: {
      title: 'Application de point de vente (POS) desktop',
      excerpt: 'POS desktop rapide et fiable pour les opérations retail quotidiennes — caisse, stock et expérience caissier fluide.',
      problem: 'Les points de vente avaient besoin d\'un POS instantané aux heures de pointe, stable sur poste fixe toute la journée.',
      solution: 'Application desktop avec interface moderne axée vitesse, clarté et fiabilité — flux de caisse, stock et transactions optimisés.',
      role: 'Développeur indépendant — architecture, UI desktop, workflows POS et performance.',
      result: 'Caissiers plus rapides, moins d\'erreurs, opérations plus claires et base évolutive.',
      body: `### Conçu pour le comptoir

Pensé pour le rythme d\'un magasin chargé : recherche rapide, minimum de clics, états toujours explicites.

### Piliers de l\'expérience

- **Rapidité en caisse** — flux optimisés aux heures de pointe
- **États opérationnels clairs** — vente en cours, terminée ou à traiter
- **Interaction stock** — accès stock sans casser le flux de vente
- **Fiabilité desktop** — performance stable toute la journée
- **Structure maintenable** — écrans modulaires pour faire évoluer les règles métier`,
    },
  },
  {
    slug: 'colon-health-app',
    order: 10,
    categories: {
      en: ['Mobile Application', 'Health & Wellness', 'Guided User Journeys', 'Data Tracking', 'Android Experience'],
      ar: ['تطبيق جوال', 'الصحة والعافية', 'مسارات إرشادية', 'تتبع البيانات', 'تجربة أندرويد'],
      fr: ['Application mobile', 'Santé & bien-être', 'Parcours guidés', 'Suivi de données', 'Expérience Android'],
    },
    en: {
      title: 'Colon Health Mobile Application',
      excerpt: 'A focused Android health app that helps users track colon wellness indicators and follow structured, easy-to-understand guidance.',
      problem: 'Users needed a simple, trustworthy way to monitor colon health habits and receive clear guidance — without a cluttered medical interface or confusing navigation.',
      solution: 'I developed a mobile health application with guided tracking flows, educational content presentation, and a calm UX designed for daily use. The app structures complex health information into approachable steps.',
      role: 'Independent mobile developer — app architecture, health tracking screens, content flows, and release preparation.',
      result: 'A polished health companion that encourages consistent tracking and gives users confidence through clarity, not complexity.',
      body: `### Health apps should feel supportive, not overwhelming

The goal was a product users open regularly — not once and abandon. Every screen answers a simple question: what should I do next?

### What users get

- **Structured health tracking** — log indicators and habits in flows that feel natural, not clinical
- **Guided journeys** — step-by-step paths that explain what matters and why
- **Educational content** — health information presented in readable, mobile-friendly sections
- **Calm visual design** — reduced cognitive load for sensitive health topics
- **Room to grow** — screen architecture ready for new modules and deeper insights

### Design philosophy

Trust is built through consistency and clarity. The app avoids jargon where possible and prioritizes accessibility for users who are not technical — because health products live or die on daily engagement.`,
    },
    ar: {
      title: 'تطبيق صحة القولون للجوال',
      excerpt: 'تطبيق صحي مركّز يساعد المستخدمين على تتبع مؤشرات صحة القولون واتباع إرشادات منظمة وسهلة الفهم.',
      problem: 'المستخدمون احتاجوا طريقة بسيطة وموثوقة لمراقبة عادات صحة القولون والحصول على إرشاد واضح — دون واجهة طبية مزدحمة أو تنقل مربك.',
      solution: 'طوّرت تطبيقًا صحيًا للجوال بتدفقات تتبع موجّهة وعرض محتوى تعليمي وتجربة هادئة للاستخدام اليومي. التطبيق يحوّل المعلومات الصحية المعقدة إلى خطوات سهلة المتابعة.',
      role: 'مطوّر موبايل مستقل — هندسة التطبيق، شاشات التتبع، مسارات المحتوى، والإعداد للنشر.',
      result: 'رفيق صحي متقن يشجّع التتبع المنتظم ويمنح المستخدم ثقة عبر الوضوح لا التعقيد.',
      body: `### تطبيق الصحة يجب أن يدعم، لا يُرهق

الهدف منتج يُفتح بانتظام — لا يُستخدم مرة ويُهمل. كل شاشة تجيب على سؤال بسيط: ماذا أفعل الآن؟

### ما يحصل عليه المستخدم

- **تتبع صحي منظم** — تسجيل المؤشرات والعادات بتدفقات طبيعية غير سريرية
- **مسارات إرشادية** — خطوات تشرح ما يهم ولماذا
- **محتوى تعليمي** — معلومات صحية بصيغة مقروءة ومناسبة للجوال
- **تصميم هادئ** — تقليل الحمل الذهني لمواضيع صحية حساسة
- **جاهز للتوسع** — هندسة شاشات تستوعب وحدات ورؤى جديدة

### فلسفة التصميم

الثقة تُبنى بالاتساق والوضوح. التطبيق يتجنب المصطلحات حيث أمكن ويخدم مستخدمًا غير تقني — لأن نجاح تطبيقات الصحة يعتمد على الاستخدام اليومي.`,
    },
    fr: {
      title: 'Application mobile santé du côlon',
      excerpt: 'Application Android focalisée pour suivre la santé du côlon et suivre des conseils structurés et accessibles.',
      problem: 'Les utilisateurs avaient besoin d\'un suivi simple et fiable, sans interface médicale surchargée.',
      solution: 'Application mobile avec parcours de suivi guidés, contenu éducatif et UX calme pour un usage quotidien.',
      role: 'Développeur mobile indépendant — architecture, écrans de suivi et préparation release.',
      result: 'Compagnon santé soigné encourageant un suivi régulier par la clarté.',
      body: `### Une app santé doit rassurer, pas submerger

Chaque écran répond à une question simple : que faire ensuite ?

### Ce que l'utilisateur obtient

- **Suivi structuré** — indicateurs et habitudes sans aspect clinique froid
- **Parcours guidés** — étapes qui expliquent l'essentiel
- **Contenu éducatif** — information lisible sur mobile
- **Design apaisant** — charge cognitive réduite
- **Évolutif** — architecture prête pour de nouveaux modules`,
    },
  },
  {
    slug: 'vtc-rental',
    order: 11,
    categories: {
      en: ['Web Platform', 'Booking & Reservations', 'Pricing Automation', 'Customer Management', 'Operations Dashboard'],
      ar: ['منصة ويب', 'حجز ومواعيد', 'تسعير آلي', 'إدارة العملاء', 'لوحة تشغيل'],
      fr: ['Plateforme web', 'Réservations', 'Tarification auto', 'Gestion clients', 'Tableau opérationnel'],
    },
    en: {
      title: 'Vehicle Rental (VTC) Platform',
      excerpt: 'A rental and ride platform connecting bookings, fleet availability, pricing, and customer management in one system.',
      problem: 'The rental business managed reservations through calls and informal tracking. Vehicle availability was unclear, pricing varied manually, and customers had no consistent booking experience.',
      solution: 'I built a VTC rental platform that centralizes bookings, vehicle assignment, automated pricing rules, and customer records — giving operators a professional system instead of improvised tools.',
      role: 'Independent full-stack developer — booking logic, operational workflows, and admin tooling.',
      result: 'Faster booking cycles, fewer scheduling conflicts, and a customer experience that feels organized and trustworthy.',
      body: `### From phone calls to a real booking engine

The platform replaces ad-hoc coordination with structured rental workflows — from the moment a customer requests a vehicle to trip completion and billing.

### Highlights

- **Online booking flows** — customers reserve vehicles with clear availability and confirmation
- **Vehicle assignment** — match requests to fleet capacity with operational rules
- **Automated pricing** — distance, duration, and service-type rules applied consistently
- **Customer profiles** — history, preferences, and repeat booking support
- **Operator dashboard** — daily schedule, active rentals, and exception management

### Operational value

Rental businesses win on reliability and speed. This system gives operators confidence that nothing falls through the cracks when volume increases.`,
    },
    ar: {
      title: 'منصة تأجير المركبات (VTC)',
      excerpt: 'منصة تأجير ونقل تربط الحجز وتوفر المركبات والتسعير وإدارة العملاء في نظام واحد.',
      problem: 'إدارة الحجوزات كانت عبر اتصالات وتتبع غير رسمي. توفر المركبات غير واضح، التسعير يدوي، وتجربة العميل غير متسقة.',
      solution: 'بنيت منصة تأجير VTC مركزية للحجوزات وإسناد المركبات وقواعد التسعير الآلي وسجلات العملاء — بدل أدوات مرتجلة.',
      role: 'مطوّر Full-stack مستقل — منطق الحجز، سير العمل التشغيلي، وأدوات الإدارة.',
      result: 'دورات حجز أسرع، تعارضات أقل في الجدولة، وتجربة عميل منظمة وموثوقة.',
      body: `### من الاتصالات الهاتفية إلى محرك حجز حقيقي

المنصة تستبدل التنسيق العشوائي بسير عمل منظم — من طلب العميل للمركبة حتى إنهاء الرحلة والفوترة.

### أبرز الميزات

- **حجز إلكتروني** — حجز مركبات مع توفر واضح وتأكيد
- **إسناد المركبات** — مطابقة الطلبات مع قدرة الأسطول بقواعد تشغيلية
- **تسعير آلي** — قواعد مسافة ومدة ونوع خدمة بشكل متسق
- **ملفات العملاء** — سجل وتفضيلات ودعم الحجز المتكرر
- **لوحة المشغّل** — جدول اليوم والإيجارات النشطة وإدارة الاستثناءات

### القيمة التشغيلية

أعمال التأجير تربح بالموثوقية والسرعة. النظام يمنح المشغّلين ثقة بعدم ضياع أي طلب مع نمو الحجم.`,
    },
    fr: {
      title: 'Plateforme de location de véhicules (VTC)',
      excerpt: 'Plateforme reliant réservations, disponibilité flotte, tarification et gestion clients.',
      problem: 'Réservations par téléphone, disponibilité floue, tarifs manuels et expérience client incohérente.',
      solution: 'Plateforme VTC centralisant réservations, affectation véhicules, tarification automatisée et dossiers clients.',
      role: 'Développeur full-stack indépendant — logique réservation et workflows opérationnels.',
      result: 'Réservations plus rapides, moins de conflits, expérience client organisée.',
      body: `### D'un flux téléphonique à un vrai moteur de réservation

Workflows structurés de la demande client à la facturation finale.

### Points forts

- **Réservation en ligne** — disponibilité et confirmation claires
- **Affectation véhicules** — règles opérationnelles de capacité
- **Tarification automatisée** — distance, durée et type de service
- **Profils clients** — historique et réservations récurrentes
- **Tableau opérateur** — planning quotidien et exceptions`,
    },
  },
  {
    slug: 'fleet-management',
    order: 12,
    categories: {
      en: ['Fleet Operations', 'Asset Management', 'Maintenance Tracking', 'Utilization Reports', 'Web Administration'],
      ar: ['عمليات الأسطول', 'إدارة الأصول', 'تتبع الصيانة', 'تقارير الاستغلال', 'إدارة ويب'],
      fr: ['Opérations flotte', 'Gestion actifs', 'Suivi maintenance', 'Rapports utilisation', 'Administration web'],
    },
    en: {
      title: 'Fleet Management System',
      excerpt: 'A fleet operations system for tracking vehicles, maintenance cycles, assignments, and utilization across the entire fleet.',
      problem: 'Fleet managers lacked a single view of which vehicles were available, under maintenance, or underused. Maintenance was reactive, and assignment decisions were based on memory rather than data.',
      solution: 'I developed a fleet management module that tracks every vehicle\'s status, maintenance schedule, assignment history, and utilization metrics — enabling proactive operations instead of firefighting.',
      role: 'Independent developer — fleet data model, operational dashboards, and maintenance workflow design.',
      result: 'Better fleet utilization, fewer unexpected breakdowns, and data-backed decisions on when to service or retire vehicles.',
      body: `### Know your fleet before problems find you

Fleet management is not a spreadsheet problem — it is an operations discipline. This system makes vehicle status visible at a glance.

### Core modules

- **Vehicle registry** — complete profiles with documents, specs, and operational history
- **Status tracking** — available, in service, maintenance, out of commission
- **Maintenance scheduling** — planned service cycles with reminders and history logs
- **Assignment tracking** — who drove what, when, and for which operation
- **Utilization analytics** — identify underused assets and optimize fleet size over time

### Why it matters

Every idle vehicle is cost. Every missed maintenance window is risk. The system turns fleet operations from guesswork into a managed process.`,
    },
    ar: {
      title: 'نظام إدارة الأسطول',
      excerpt: 'نظام تشغيلي لتتبع المركبات ودورات الصيانة والإسناد ونسب الاستغلال عبر الأسطول كاملًا.',
      problem: 'مديرو الأسطول افتقدوا رؤية موحدة للمركبات المتاحة أو قيد الصيانة أو غير المستغلة. الصيانة كانت ردّ فعل، والقرارات تعتمد على الذاكرة لا البيانات.',
      solution: 'طوّرت وحدة إدارة أسطول تتتبع حالة كل مركبة وجدول الصيانة وسجل الإسناد ومقاييس الاستغلال — لتشغيل استباقي بدل إطفاء الحرائق.',
      role: 'مطوّر مستقل — نموذج بيانات الأسطول، لوحات تشغيل، وتصميم سير عمل الصيانة.',
      result: 'استغلال أفضل للأسطول، أعطال أقل مفاجئة، وقرارات مبنية على بيانات للصيانة أو التخارج.',
      body: `### اعرف أسطولك قبل أن تجدك المشاكل

إدارة الأسطول ليست جدولًا — إنها انضباط تشغيلي. النظام يجعل حالة المركبات واضحة بلمحة.

### الوحدات الأساسية

- **سجل المركبات** — ملفات كاملة مع وثائق ومواصفات وسجل تشغيلي
- **تتبع الحالة** — متاحة، في خدمة، صيانة، خارج الخدمة
- **جدولة الصيانة** — دورات مخططة مع تذكيرات وسجلات
- **تتبع الإسناد** — من قاد ماذا ومتى ولأي عملية
- **تحليلات الاستغلال** — رصد الأصول غير المستغلة وتحسين حجم الأسطول

### لماذا يهم

كل مركبة خاملة تكلفة. كل صيانة فائتة مخاطرة. النظام يحوّل تشغيل الأسطول من تخمين إلى عملية مُدارة.`,
    },
    fr: {
      title: 'Système de gestion de flotte',
      excerpt: 'Système opérationnel pour suivre véhicules, maintenance, affectations et taux d\'utilisation.',
      problem: 'Pas de vue unique sur disponibilité, maintenance ou sous-utilisation. Décisions basées sur la mémoire.',
      solution: 'Module de gestion de flotte avec statut, planning maintenance, historique d\'affectation et métriques d\'utilisation.',
      role: 'Développeur indépendant — modèle de données, tableaux de bord et workflows maintenance.',
      result: 'Meilleure utilisation, moins de pannes imprévues, décisions basées sur les données.',
      body: `### Connaître sa flotte avant les problèmes

La gestion de flotte est une discipline opérationnelle, pas un tableur.

### Modules clés

- **Registre véhicules** — profils complets et historique
- **Suivi des statuts** — disponible, en service, maintenance, hors service
- **Planning maintenance** — cycles planifiés et rappels
- **Suivi des affectations** — qui, quand, quelle opération
- **Analytique d'utilisation** — optimiser la taille de la flotte`,
    },
  },
  {
    slug: 'transport-management',
    order: 13,
    categories: {
      en: ['Transport Operations', 'Dispatch Coordination', 'Route Planning', 'Driver Management', 'Live Operations'],
      ar: ['عمليات النقل', 'تنسيق الإرسال', 'تخطيط المسارات', 'إدارة السائقين', 'تشغيل لحظي'],
      fr: ['Opérations transport', 'Coordination dispatch', 'Planification routes', 'Gestion chauffeurs', 'Opérations live'],
    },
    en: {
      title: 'Transport Management System',
      excerpt: 'An operations platform for coordinating drivers, routes, dispatch decisions, and daily transport workflows.',
      problem: 'Dispatch teams coordinated drivers through messages and manual lists. Route changes were slow to communicate, driver availability was unclear, and daily transport plans were hard to adjust in real time.',
      solution: 'I built a transport management system that unifies driver scheduling, route coordination, dispatch assignments, and live operational updates — so teams respond to change instead of chasing it.',
      role: 'Independent developer — dispatch workflows, driver management logic, and operational monitoring interfaces.',
      result: 'Smoother daily transport operations, faster response to route changes, and clearer accountability across drivers and dispatchers.',
      body: `### Dispatch is a real-time discipline

Transport operations do not wait for end-of-day reports. This system is built for the pace of live coordination.

### Platform capabilities

- **Driver management** — profiles, availability, assignments, and performance history
- **Dispatch board** — assign trips, re-route on the fly, and track active operations
- **Route coordination** — plan and adjust routes with operational constraints in mind
- **Live status updates** — everyone sees the same operational picture
- **Daily operations summary** — completed trips, delays, exceptions, and handoff notes

### The outcome

When dispatch has clarity, the entire transport chain moves faster. This platform turns coordination from a constant phone chase into a managed operational workflow.`,
    },
    ar: {
      title: 'نظام إدارة النقل',
      excerpt: 'منصة تشغيلية لتنسيق السائقين والمسارات وقرارات الإرسال وسير العمل اليومي للنقل.',
      problem: 'فرق الإرسال كانت تنسّق السائقين عبر رسائل وقوائم يدوية. تغيير المسارات بطيء، توفر السائقين غير واضح، وخطط النقل اليومية صعبة التعديل لحظيًا.',
      solution: 'بنيت نظام إدارة نقل يوحّد جدولة السائقين وتنسيق المسارات وإسناد الرحلات وتحديثات التشغيل الحية — ليستجيب الفريق للتغيير بدل مطاردته.',
      role: 'مطوّر مستقل — سير عمل الإرسال، منطق إدارة السائقين، وواجهات المراقبة التشغيلية.',
      result: 'عمليات نقل يومية أنعم، استجابة أسرع لتغيير المسارات، ومساءلة أوضح بين السائقين والمُرسِلين.',
      body: `### الإرسال انضباط لحظي

عمليات النقل لا تنتظر تقارير نهاية اليوم. النظام مبني لإيقاع التنسيق المباشر.

### قدرات المنصة

- **إدارة السائقين** — ملفات وتوفر وإسناد وسجل أداء
- **لوحة الإرسال** — إسناد رحلات وإعادة توجيه وتتبع العمليات النشطة
- **تنسيق المسارات** — تخطيط وتعديل مع مراعاة قيود التشغيل
- **تحديثات حالة حية** — صورة تشغيلية واحدة للجميع
- **ملخص العمليات اليومية** — رحلات مكتملة وتأخيرات واستثناءات

### النتيجة

عندما يملك الإرسال وضوحًا، تتحرك سلسلة النقل أسرع. المنصة تحوّل التنسيق من مطاردة هاتفية إلى سير عمل مُدار.`,
    },
    fr: {
      title: 'Système de gestion du transport',
      excerpt: 'Plateforme pour coordonner chauffeurs, itinéraires, dispatch et opérations quotidiennes.',
      problem: 'Coordination par messages et listes manuelles. Changements de route lents, disponibilité floue.',
      solution: 'Système unifiant planification chauffeurs, coordination routes, affectations dispatch et mises à jour live.',
      role: 'Développeur indépendant — workflows dispatch, gestion chauffeurs et monitoring.',
      result: 'Opérations plus fluides, réponse rapide aux changements, responsabilité claire.',
      body: `### Le dispatch est une discipline en temps réel

Conçu pour le rythme de la coordination live, pas les rapports de fin de journée.

### Capacités

- **Gestion chauffeurs** — profils, disponibilité, affectations
- **Tableau dispatch** — affecter, réorienter, suivre les opérations actives
- **Coordination routes** — planifier et ajuster selon les contraintes
- **Statuts live** — même image opérationnelle pour tous
- **Résumé quotidien** — trajets, retards et exceptions`,
    },
  },
];

const projects = [
  ...enterpriseProjects.map((p, i) => ({ ...p, order: i + 1 })),
  ...freelancerProjects,
];

function renderProject(locale, project) {
  const data = project[locale];
  const categories = project.categories[locale];
  const yaml = `---
title: ${JSON.stringify(data.title)}
excerpt: ${JSON.stringify(data.excerpt)}
problem: ${JSON.stringify(data.problem)}
solution: ${JSON.stringify(data.solution)}
role: ${JSON.stringify(data.role)}
result: ${JSON.stringify(data.result)}
technologies:
${categories.map((c) => `  - ${JSON.stringify(c)}`).join('\n')}
cover: /images/projects/placeholder.svg
order: ${project.order}
featured: true
translationOf: ${project.slug}
---

${data.body}
`;
  return yaml;
}

for (const locale of locales) {
  const dir = join(base, locale);
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.md')) unlinkSync(join(dir, file));
  }
  mkdirSync(dir, { recursive: true });
  for (const project of projects) {
    writeFileSync(join(dir, `${project.slug}.md`), renderProject(locale, project), 'utf8');
  }
}

console.log(`Generated ${projects.length * locales.length} portfolio files (${enterpriseProjects.length} enterprise + ${freelancerProjects.length} freelance).`);
