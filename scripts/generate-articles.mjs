import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const covers = [
  { slug: 'multi-tenant-laravel', label: 'Multi-Tenancy', fill: '#DDE8F0' },
  { slug: 'laravel-queue-production', label: 'Queues at Scale', fill: '#E8E4DC' },
  { slug: 'api-idempotency-webhooks', label: 'Idempotency & Webhooks', fill: '#F0E8DD' },
  { slug: 'laravel-rbac-enterprise', label: 'Enterprise RBAC', fill: '#E4E8E0' },
  { slug: 'database-sagas-laravel', label: 'Sagas in Laravel', fill: '#E8DDE8' },
];

for (const { slug, label, fill } of covers) {
  const path = join(ROOT, `public/images/articles/${slug}.svg`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="472" viewBox="0 0 840 472">
  <rect width="840" height="472" fill="${fill}"/>
  <text x="420" y="236" text-anchor="middle" fill="#6B6860" font-family="monospace" font-size="15">${label}</text>
</svg>`,
  );
}

const articles = {
  'multi-tenant-laravel': {
    ar: {
      title: 'بناء منصات SaaS متعددة المستأجرين في Laravel — استراتيجيات العزل التي تصمد في الإنتاج',
      excerpt:
        'مقارنة عملية بين قواعد بيانات منفصلة، مخططات مشتركة، وأعمدة المستأجر: متى تختار كل نموذج، وكيف تتجنب تسريب البيانات والديون التقنية.',
      category: 'الهندسة المعمارية',
      publishedAt: '2025-09-10',
      readingTime: 20,
      tags: ['Laravel', 'Multi-Tenancy', 'SaaS', 'Architecture'],
    },
    en: {
      title: 'Building Multi-Tenant SaaS in Laravel — Isolation Strategies That Survive Production',
      excerpt:
        'A practical comparison of separate databases, shared schemas, and tenant columns: when to choose each model and how to avoid data leaks and technical debt.',
      category: 'Architecture',
      publishedAt: '2025-09-10',
      readingTime: 20,
      tags: ['Laravel', 'Multi-Tenancy', 'SaaS', 'Architecture'],
    },
    fr: {
      title: 'Construire un SaaS multi-tenant avec Laravel — stratégies d\'isolation qui tiennent en production',
      excerpt:
        'Comparaison pratique des bases séparées, schémas partagés et colonnes tenant : quand choisir chaque modèle et comment éviter les fuites de données.',
      category: 'Architecture',
      publishedAt: '2025-09-10',
      readingTime: 20,
      tags: ['Laravel', 'Multi-Tenancy', 'SaaS', 'Architecture'],
    },
  },
  'laravel-queue-production': {
    ar: {
      title: 'طوابير Laravel في الإنتاج — الموثوقية، الضغط العكسي، والمراقبة',
      excerpt:
        'من Redis إلى Horizon: تصميم مهام لا تضيع، إعادة محاولة ذكية، dead-letter queues، وكيف تكتشف الاختناقات قبل أن يشتكي العملاء.',
      category: 'البنية التحتية',
      publishedAt: '2025-10-05',
      readingTime: 18,
      tags: ['Laravel', 'Queues', 'Redis', 'Horizon'],
    },
    en: {
      title: 'Laravel Queues at Scale — Reliability, Backpressure, and Observability',
      excerpt:
        'From Redis to Horizon: designing jobs that don\'t get lost, smart retries, dead-letter queues, and spotting bottlenecks before customers complain.',
      category: 'Infrastructure',
      publishedAt: '2025-10-05',
      readingTime: 18,
      tags: ['Laravel', 'Queues', 'Redis', 'Horizon'],
    },
    fr: {
      title: 'Files d\'attente Laravel à l\'échelle — fiabilité, contre-pression et observabilité',
      excerpt:
        'De Redis à Horizon : concevoir des jobs qui ne se perdent pas, des retries intelligents, des dead-letter queues et détecter les goulots avant les clients.',
      category: 'Infrastructure',
      publishedAt: '2025-10-05',
      readingTime: 18,
      tags: ['Laravel', 'Queues', 'Redis', 'Horizon'],
    },
  },
  'api-idempotency-webhooks': {
    ar: {
      title: 'مفاتيح التكرار الآمن والـ Webhooks — وهم التنفيذ مرة واحدة في أنظمة الدفع',
      excerpt:
        'لماذا تفشل معاملات الدفع المكررة، كيف تصمم Idempotency Keys صحيحة، وتتعامل مع webhooks متأخرة أو مكررة دون كسر المحاسبة.',
      category: 'تصميم API',
      publishedAt: '2025-12-01',
      readingTime: 19,
      tags: ['API', 'Payments', 'Webhooks', 'Idempotency'],
    },
    en: {
      title: 'Idempotency Keys and Webhooks — The Exactly-Once Illusion in Payment Systems',
      excerpt:
        'Why duplicate payment operations fail, how to design correct idempotency keys, and handle late or duplicate webhooks without breaking accounting.',
      category: 'API Design',
      publishedAt: '2025-12-01',
      readingTime: 19,
      tags: ['API', 'Payments', 'Webhooks', 'Idempotency'],
    },
    fr: {
      title: 'Clés d\'idempotence et webhooks — l\'illusion du exactly-once dans les paiements',
      excerpt:
        'Pourquoi les opérations de paiement dupliquées échouent, comment concevoir des clés d\'idempotence correctes et gérer les webhooks tardifs ou dupliqués.',
      category: 'Conception API',
      publishedAt: '2025-12-01',
      readingTime: 19,
      tags: ['API', 'Payments', 'Webhooks', 'Idempotency'],
    },
  },
  'laravel-rbac-enterprise': {
    ar: {
      title: 'RBAC يتجاوز الأدوار — حدود الصلاحيات في منصات Laravel المؤسسية',
      excerpt:
        'من أدوار بسيطة إلى سياسات معقدة: صلاحيات على مستوى المورد، التفويض المؤقت، والتدقيق — دون تحويل كل controller إلى متاهة if.',
      category: 'الأمان',
      publishedAt: '2026-02-15',
      readingTime: 17,
      tags: ['Laravel', 'RBAC', 'Security', 'Enterprise'],
    },
    en: {
      title: 'RBAC Beyond Roles — Permission Boundaries in Enterprise Laravel Platforms',
      excerpt:
        'From simple roles to complex policies: resource-level permissions, temporary delegation, and audit trails — without turning every controller into an if-maze.',
      category: 'Security',
      publishedAt: '2026-02-15',
      readingTime: 17,
      tags: ['Laravel', 'RBAC', 'Security', 'Enterprise'],
    },
    fr: {
      title: 'RBAC au-delà des rôles — frontières de permissions dans les plateformes Laravel d\'entreprise',
      excerpt:
        'Des rôles simples aux politiques complexes : permissions au niveau ressource, délégation temporaire et audit — sans labyrinthe de if dans chaque contrôleur.',
      category: 'Sécurité',
      publishedAt: '2026-02-15',
      readingTime: 17,
      tags: ['Laravel', 'RBAC', 'Security', 'Enterprise'],
    },
  },
  'database-sagas-laravel': {
    ar: {
      title: 'معاملات موزعة بدون Two-Phase Commit — نمط Saga في Laravel',
      excerpt:
        'عندما تتجاوز المعاملة قاعدة بيانات واحدة: orchestration مقابل choreography، تعويض الأخطاء، وضمان الاتساق عبر خدمات الدفع والإشعارات.',
      category: 'الهندسة المعمارية',
      publishedAt: '2026-03-20',
      readingTime: 21,
      tags: ['Laravel', 'Saga', 'Distributed Systems', 'Transactions'],
    },
    en: {
      title: 'Distributed Transactions Without Two-Phase Commit — Saga Pattern in Laravel',
      excerpt:
        'When a transaction spans more than one database: orchestration vs choreography, compensating actions, and consistency across payment and notification services.',
      category: 'Architecture',
      publishedAt: '2026-03-20',
      readingTime: 21,
      tags: ['Laravel', 'Saga', 'Distributed Systems', 'Transactions'],
    },
    fr: {
      title: 'Transactions distribuées sans two-phase commit — le pattern Saga dans Laravel',
      excerpt:
        'Quand une transaction dépasse une seule base : orchestration vs choreography, actions compensatoires et cohérence entre paiement et notifications.',
      category: 'Architecture',
      publishedAt: '2026-03-20',
      readingTime: 21,
      tags: ['Laravel', 'Saga', 'Distributed Systems', 'Transactions'],
    },
  },
};

const bodies = {
  'multi-tenant-laravel': {
    ar: `بناء منصة SaaS متعددة المستأجرين ليس مجرد إضافة عمود \`tenant_id\` على كل جدول. السؤال الحقيقي: **أين يبدأ العزل، وأين ينتهي؟**

بعد قيادة عدة منصات مؤسسية — تعليم، فعاليات، منح، عضويات — تعلّمت أن اختيار نموذج التعددية في اليوم الأول يحدد تكلفة الصيانة لسنوات.

## ثلاثة نماذج، ثلاثة مقايضات

### 1. قاعدة بيانات لكل مستأجر (Database-per-tenant)

كل عميل يحصل على قاعدة بيانات منفصلة. العزل أقصى ما يمكن. مناسب للعملاء المؤسسيين الذين يطلبون عقود امتثال صارمة.

**المزايا:**
- عزل بيانات شبه مادي — خطأ في الاستعلام لا يكشف بيانات جار
- نسخ احتياطي واستعادة لكل عميل على حدة
- إمكانية نقل عميل كبير إلى خادم مخصص

**العيوب:**
- تكلفة تشغيلية عالية (مئات الاتصالات، ترحيلات مكررة)
- تعقيد في CI/CD: كل ترحيل يجب أن يمر على N قواعد
- صعوبة في التقارير العابرة للمستأجرين

في Laravel، الحزم مثل \`stancl/tenancy\` تُبسّط التبديل بين الاتصالات، لكن **لا تُبسّط إدارة 200 قاعدة بيانات**.

### 2. مخطط مشترك + عمود tenant_id (Shared schema)

النموذج الأكثر شيوعًا. جدول واحد، فلترة بـ \`where tenant_id = ?\` في كل استعلام.

**المزايا:**
- بساطة التشغيل — قاعدة واحدة، ترحيل واحد
- تقارير وتحليلات أسهل
- تكلفة أقل للبداية

**العيوب:**
- خطر تسريب البيانات إذا نسيت الفلترة في استعلام واحد
- جداول ضخمة مع نمو المستأجرين
- صعوبة في تخصيص المخطط لعميل واحد

**القاعدة الذهبية:** Global Scope على كل نموذج Eloquent يحمل \`tenant_id\`. لا استثناءات. اختبارات تلقائية تتحقق أن كل استعلام خام يحتوي الفلتر.

\`\`\`php
// TenantScope — لا تترك هذا للذاكرة
protected static function booted(): void
{
    static::addGlobalScope('tenant', function (Builder $builder) {
        if ($tenantId = tenant()?->id) {
            $builder->where('tenant_id', $tenantId);
        }
    });
}
\`\`\`

### 3. مخططات منفصلة داخل قاعدة واحدة (Schema-per-tenant)

وسط بين النموذجين. كل مستأجر له مخطط PostgreSQL خاص (\`tenant_abc\`, \`tenant_xyz\`).

نادر في Laravel لكن مفيد عندما تحتاج عزلًا أقوى من العمود دون تكلفة قواعد منفصلة.

## كيف أختار؟

| المعيار | DB-per-tenant | Shared + column | Schema-per-tenant |
|---------|---------------|-----------------|-------------------|
| عدد المستأجرين | < 50 مؤسسي | 50 – 10,000 | 100 – 500 |
| متطلبات الامتثال | عالية جدًا | متوسطة | عالية |
| حجم الفريق | كبير | صغير–متوسط | متوسط |
| تكلفة البنية | مرتفعة | منخفضة | متوسطة |

## أخطاء شائعة رأيتها في الإنتاج

**1. تسريب المستأجر عبر الـ Cache**

تخزين \`User::find(1)\` في Redis بدون بادئة المستأجر يعني أن مستأجر A قد يقرأ مستخدم مستأجر B إذا تشابكت المفاتيح.

الحل: \`Cache::tags(['tenant:'.$tenantId])\` أو بادئة إلزامية في كل مفتاح.

**2. الملفات المشتركة على S3**

مسار \`/uploads/avatar.jpg\` بدون مجلد المستأجر = كارثة. استخدم \`/tenants/{id}/uploads/\` دائمًا.

**3. الطوابير بدون سياق المستأجر**

Job يُنفَّذ بدون معرفة المستأجر الحالي. مرّر \`tenantId\` في الـ payload واستعد الاتصال في \`handle()\`.

**4. البحث النصي الكامل (Full-text)**

Elasticsearch index واحد لكل المنصة؟ فلترة إلزامية. Index منفصل لكل مستأجر كبير؟ أفضل للأداء.

## التبديل بين المستأجرين: الطبقة الحرجة

في Laravel، التبديل يحدث عادة عبر:
- **Subdomain:** \`acme.platform.com\`
- **Domain مخصص:** \`portal.client.com\`
- **Header:** \`X-Tenant-ID\` للـ API

Middleware يحل المستأجر، يتحقق من حالته (نشط؟ مدفوع؟)، ويضبط السياق:

\`\`\`php
public function handle(Request $request, Closure $next)
{
    $tenant = $this->resolver->resolve($request);

    if (!$tenant || $tenant->isSuspended()) {
        abort(403);
    }

    TenantContext::set($tenant);

    return $next($request);
}
\`\`\`

## الترحيل بين النماذج

السيناريو الواقعي: بدأت بـ shared schema، عميل مؤسسي كبير يطلب عزلًا. الحل ليس إعادة كتابة المنصة — بل **مسار ترحيل**:

1. تجميد بيانات العميل (وضع قراءة فقط)
2. تصدير بياناته إلى قاعدة/schema منفصل
3. تحديث resolver ليوجّه هذا العميل للاتصال الجديد
4. التحقق من التكامل (checksums، عدد السجلات)
5. فتح الوصول

## الخلاصة

لا يوجد نموذج «أفضل» مطلقًا. يوجد نموذج **مناسب لمرحلة منتجك وعقودك**.

- ابدأ بـ **shared schema + global scopes** إذا كان عدد المستأجرين < 500 وليس لديك متطلبات امتثال صارمة.
- انتقل لـ **DB-per-tenant** عندما يدفعك عقد أو حجم بيانات — لا عندما يبدو «أنظف» في رسم معماري.
- استثمر مبكرًا في **اختبارات تسريب المستأجر** — أرخص بكثير من تفسير خرق بيانات.

التعددية ليست ميزة في العرض التسويقي. إنها التزام تشغيلي يومي.`,

    en: `Building a multi-tenant SaaS platform is not just adding a \`tenant_id\` column to every table. The real question is: **where does isolation begin, and where does it end?**

After leading several enterprise platforms — e-learning, events, grants, memberships — I learned that the multi-tenancy model you choose on day one determines maintenance cost for years.

## Three models, three trade-offs

### 1. Database-per-tenant

Each customer gets a separate database. Maximum isolation. Suitable for enterprise clients demanding strict compliance contracts.

**Pros:**
- Near-physical data isolation — a query mistake won't expose a neighbor's data
- Per-client backup and restore
- Ability to move a large client to dedicated infrastructure

**Cons:**
- High operational cost (hundreds of connections, duplicated migrations)
- CI/CD complexity: every migration must run across N databases
- Cross-tenant reporting is painful

In Laravel, packages like \`stancl/tenancy\` simplify connection switching, but **they don't simplify managing 200 databases**.

### 2. Shared schema + tenant_id column

The most common model. One table, filter with \`where tenant_id = ?\` on every query.

**Pros:**
- Operational simplicity — one database, one migration path
- Easier reporting and analytics
- Lower startup cost

**Cons:**
- Data leak risk if you forget the filter in one query
- Massive tables as tenants grow
- Hard to customize schema for a single client

**Golden rule:** Global Scope on every Eloquent model carrying \`tenant_id\`. No exceptions. Automated tests verifying every raw query includes the filter.

\`\`\`php
protected static function booted(): void
{
    static::addGlobalScope('tenant', function (Builder $builder) {
        if ($tenantId = tenant()?->id) {
            $builder->where('tenant_id', $tenantId);
        }
    });
}
\`\`\`

### 3. Schema-per-tenant within one database

A middle ground. Each tenant gets a dedicated PostgreSQL schema (\`tenant_abc\`, \`tenant_xyz\`).

Rare in Laravel but useful when you need stronger isolation than a column without the cost of separate databases.

## How to choose

| Criterion | DB-per-tenant | Shared + column | Schema-per-tenant |
|-----------|---------------|-----------------|-------------------|
| Tenant count | < 50 enterprise | 50 – 10,000 | 100 – 500 |
| Compliance | Very high | Medium | High |
| Team size | Large | Small–medium | Medium |
| Infra cost | High | Low | Medium |

## Common production mistakes I've seen

**1. Tenant leakage through Cache**

Caching \`User::find(1)\` in Redis without a tenant prefix means tenant A may read tenant B's user if keys collide.

Fix: \`Cache::tags(['tenant:'.$tenantId])\` or mandatory key prefixes.

**2. Shared files on S3**

Path \`/uploads/avatar.jpg\` without a tenant folder = disaster. Always use \`/tenants/{id}/uploads/\`.

**3. Queues without tenant context**

A job runs without knowing the current tenant. Pass \`tenantId\` in the payload and restore the connection in \`handle()\`.

**4. Full-text search**

One Elasticsearch index for the whole platform? Mandatory filtering. Separate index per large tenant? Better performance.

## Tenant resolution: the critical layer

In Laravel, resolution typically happens via:
- **Subdomain:** \`acme.platform.com\`
- **Custom domain:** \`portal.client.com\`
- **Header:** \`X-Tenant-ID\` for APIs

Middleware resolves the tenant, checks status (active? paid?), and sets context.

## Migrating between models

The real scenario: you started with shared schema, a large enterprise client demands isolation. The answer isn't rewriting the platform — it's a **migration path**:

1. Freeze client data (read-only mode)
2. Export to separate database/schema
3. Update resolver to route this client to the new connection
4. Verify integrity (checksums, record counts)
5. Open access

## Conclusion

There is no universally "best" model. There is a model **appropriate for your product stage and contracts**.

- Start with **shared schema + global scopes** if tenants < 500 and compliance isn't strict.
- Move to **DB-per-tenant** when a contract or data volume forces it — not because it looks "cleaner" in a diagram.
- Invest early in **tenant leak tests** — far cheaper than explaining a data breach.

Multi-tenancy isn't a marketing feature. It's a daily operational commitment.`,

    fr: `Construire une plateforme SaaS multi-tenant ne se résume pas à ajouter une colonne \`tenant_id\` sur chaque table. La vraie question : **où commence l'isolation, et où s'arrête-t-elle ?**

Après avoir dirigé plusieurs plateformes d'entreprise — e-learning, événements, subventions, adhésions — j'ai appris que le modèle choisi le jour J détermine le coût de maintenance pendant des années.

## Trois modèles, trois compromis

### 1. Base de données par tenant

Chaque client dispose d'une base séparée. Isolation maximale. Adapté aux clients exigeant des contrats de conformité stricts.

**Avantages :** isolation quasi physique, sauvegarde par client, migration vers infrastructure dédiée possible.

**Inconvénients :** coût opérationnel élevé, complexité CI/CD (migrations × N bases), reporting trans-tenant difficile.

Des packages Laravel comme \`stancl/tenancy\` simplifient le changement de connexion, mais **pas la gestion de 200 bases**.

### 2. Schéma partagé + colonne tenant_id

Le modèle le plus courant. Une table, filtrage \`where tenant_id = ?\` sur chaque requête.

**Avantages :** simplicité opérationnelle, reporting plus facile, coût initial bas.

**Inconvénients :** risque de fuite si un filtre est oublié, tables massives, personnalisation par client difficile.

**Règle d'or :** Global Scope sur chaque modèle Eloquent portant \`tenant_id\`. Aucune exception. Tests automatisés vérifiant chaque requête brute.

### 3. Schéma par tenant dans une même base

Compromis intermédiaire. Chaque tenant a un schéma PostgreSQL dédié.

Rare sous Laravel mais utile pour une isolation supérieure sans le coût de bases séparées.

## Erreurs courantes en production

**1. Fuite via le cache** — clés Redis sans préfixe tenant.

**2. Fichiers S3 partagés** — toujours \`/tenants/{id}/uploads/\`.

**3. Files sans contexte tenant** — passer \`tenantId\` dans le payload du job.

**4. Recherche full-text** — filtrage obligatoire ou index séparé par gros tenant.

## Résolution du tenant

- **Sous-domaine :** \`acme.platform.com\`
- **Domaine personnalisé :** \`portal.client.com\`
- **Header :** \`X-Tenant-ID\` pour les API

Un middleware résout le tenant, vérifie son statut et définit le contexte.

## Conclusion

Pas de modèle universellement « meilleur ». Un modèle **adapté à votre stade et vos contrats**.

- Démarrez en **schéma partagé + global scopes** si < 500 tenants et conformité modérée.
- Passez au **DB-per-tenant** quand un contrat l'exige — pas pour l'esthétique d'un diagramme.
- Investissez tôt dans les **tests de fuite tenant**.

Le multi-tenant n'est pas une fonctionnalité marketing. C'est un engagement opérationnel quotidien.`,
  },

  'laravel-queue-production': {
    ar: `الطوابير في Laravel تبدو بسيطة في التطوير: \`dispatch(new SendInvoice($order))\` وتنتهي القصة. في الإنتاج مع آلاف المهام يوميًا، القصة مختلفة تمامًا.

## لماذا تفشل الطوابير بصمت؟

الفشل الصامت أخطر من الانهيار الصريح. مهمة تُفقد، فاتورة لا تُرسل، عميل لا يُبلَّغ — ولا أحد يعرف حتى يشتكي المستخدم.

الأسباب الشائعة:
- **Timeout في Worker** — مهمة تحتاج 5 دقائق، الـ worker يقتلها بعد 60 ثانية
- **ذاكرة** — تحميل 50,000 سجل في job واحد
- **Serialization** — تمرير Eloquent model كامل مع علاقاته
- **Race condition** — نفس المهمة تُنفَّذ مرتين بعد retry

## تصميم المهام: قواعد لا تتفاوض عليها

### 1. المهام صغيرة وقابلة لإعادة المحاولة

\`\`\`php
// ❌ سيء — كل شيء في مهمة واحدة
ProcessMonthlyReport::dispatch($tenantId);

// ✅ جيد — تقسيم
foreach ($tenant->users as $user) {
    GenerateUserReportChunk::dispatch($tenantId, $user->id);
}
\`\`\`

### 2. مرّر المعرفات، لا النماذج

\`\`\`php
public function __construct(
    public readonly int $orderId,
    public readonly int $tenantId,
) {}
\`\`\`

أعد تحميل النموذج في \`handle()\`. النموذج قد يتغير أو يُحذف بين الإرسال والتنفيذ.

### 3. حدد $tries و$backoff بوعي

\`\`\`php
public int $tries = 5;
public array $backoff = [30, 60, 120, 300, 600];

public function retryUntil(): DateTime
{
    return now()->addHours(6);
}
\`\`\`

إعادة محاولة فورية × 100 على خطأ في API خارجي = حظر IP.

## Horizon: ما وراء لوحة المراقبة

Laravel Horizon ليس مجرد واجهة جميلة. استخدمه لـ:

- **Auto-scaling workers** حسب طول الطابور
- **تقسيم الطوابير** — \`high\`, \`default\`, \`low\`, \`webhooks\`
- **Metrics** — throughput، runtime، failed jobs

\`\`\`php
// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-high' => [
            'connection' => 'redis',
            'queue' => ['webhooks', 'payments'],
            'maxProcesses' => 10,
            'timeout' => 120,
        ],
        'supervisor-default' => [
            'queue' => ['default', 'emails'],
            'maxProcesses' => 5,
            'timeout' => 300,
        ],
    ],
],
\`\`\`

## Dead Letter Queue: المهام الميتة

بعد استنفاد المحاولات، لا تترك المهمة في \`failed_jobs\` وانسَها.

النمط الذي أستخدمه:

1. \`failed()\` method في الـ Job يسجّل السياق الكامل
2. تنبيه Slack/PagerDuty للمهام الحرجة (دفع، إلغاء اشتراك)
3. واجهة إدارية لإعادة المحاولة اليدوية مع مراجعة

\`\`\`php
public function failed(Throwable $e): void
{
    CriticalJobFailed::dispatch(
        job: static::class,
        payload: $this->orderId,
        error: $e->getMessage(),
    );
}
\`\`\`

## Idempotency في المهام

Webhook من بوابة دفع يصل مرتين؟ Job يُنفَّذ مرتين؟

\`\`\`php
public function handle(): void
{
    $lock = Cache::lock("job:payment:{$this->paymentId}", 300);

    if (!$lock->get()) {
        return; // مهمة أخرى تعالج نفس الدفع
    }

    try {
        if (Payment::where('external_id', $this->paymentId)->exists()) {
            return; // تمت المعالجة مسبقًا
        }
        $this->processPayment();
    } finally {
        $lock->release();
    }
}
\`\`\`

## المراقبة: ما تقيسه يُدار

المقاييس التي أتابعها يوميًا:

| المقياس | عتبة التنبيه |
|---------|-------------|
| Queue depth (webhooks) | > 500 لأكثر من 5 دقائق |
| Job runtime p95 | > 60 ثانية |
| Failed jobs / hour | > 10 |
| Worker memory | > 80% |

استخدم Horizon metrics + Cloudflare/analytics أو Prometheus exporter.

## Scheduled tasks مقابل Queued jobs

\`$schedule->command('reports:generate')->daily()\` يعمل على **خادم واحد**. إذا كان هذا الخادم معطلاً، لا تقرير.

الأفضل: Scheduler يُرسل jobs إلى الطابور:

\`\`\`php
$schedule->job(new GenerateDailyReports)->dailyAt('02:00');
\`\`\`

Workers على عدة خوادم يتنافسون على التنفيذ — لا نقطة فشل واحدة.

## الخلاصة

الطوابير ليست «إرسال بريد في الخلفية». إنها **عمود فقري للموثوقية**.

- صغّر المهام
- مرّر المعرفات
- افصل الطوابير حسب الأولوية
- راقب العمق والفشل
- اجعل المهام الحرجة idempotent

عندما يعمل النظام بصمت لشهور، هذا يعني أنك بنيته بشكل صحيح — لا أنك محظوظ.`,

    en: `Queues in Laravel feel simple in development: \`dispatch(new SendInvoice($order))\` and you're done. In production with thousands of jobs per day, the story is completely different.

## Why queues fail silently

Silent failure is worse than a loud crash. A job gets lost, an invoice never sends, a client never gets notified — and nobody knows until the user complains.

Common causes:
- **Worker timeout** — job needs 5 minutes, worker kills it after 60 seconds
- **Memory** — loading 50,000 records in one job
- **Serialization** — passing a full Eloquent model with relationships
- **Race conditions** — same job runs twice after retry

## Job design: non-negotiable rules

### 1. Small, retryable jobs

Split large work into chunks. One monthly report job becomes hundreds of per-user chunk jobs.

### 2. Pass IDs, not models

Reload the model in \`handle()\`. It may change or be deleted between dispatch and execution.

### 3. Set $tries and $backoff deliberately

Instant retry × 100 on an external API error = IP ban.

## Horizon: beyond the dashboard

Use Horizon for auto-scaling workers, queue separation (\`high\`, \`default\`, \`low\`, \`webhooks\`), and throughput metrics.

## Dead letter handling

After exhausting retries, don't leave jobs in \`failed_jobs\` and forget them.

Pattern:
1. \`failed()\` logs full context
2. Alert Slack/PagerDuty for critical jobs (payments, cancellations)
3. Admin UI for manual retry with review

## Idempotency in jobs

Payment webhook arrives twice? Job runs twice?

Use \`Cache::lock()\` and check if already processed before acting.

## Monitoring

| Metric | Alert threshold |
|--------|-----------------|
| Queue depth (webhooks) | > 500 for 5+ minutes |
| Job runtime p95 | > 60 seconds |
| Failed jobs / hour | > 10 |
| Worker memory | > 80% |

## Scheduled tasks vs queued jobs

\`$schedule->command()->daily()\` runs on **one server**. If it's down, no report.

Better: scheduler dispatches jobs to the queue. Workers on multiple servers compete — no single point of failure.

## Conclusion

Queues aren't "send email in the background." They're the **backbone of reliability**.

- Shrink jobs
- Pass IDs
- Separate queues by priority
- Monitor depth and failures
- Make critical jobs idempotent

When the system runs silently for months, you built it right — not got lucky.`,

    fr: `Les files d'attente Laravel semblent simples en développement. En production avec des milliers de jobs par jour, l'histoire est tout autre.

## Pourquoi les files échouent en silence

Un job perdu, une facture jamais envoyée, un client non notifié — et personne ne le sait avant la plainte.

Causes fréquentes : timeout worker, mémoire, sérialisation de modèles Eloquent complets, race conditions après retry.

## Règles de conception

1. **Jobs petits et retryables** — découper le travail
2. **Passer des IDs, pas des modèles** — recharger dans \`handle()\`
3. **$tries et $backoff** conscients — éviter le ban IP

## Horizon

Auto-scaling, séparation des queues (\`webhooks\`, \`payments\`, \`emails\`), métriques de throughput.

## Dead letter

Après épuisement des retries : log complet, alertes pour jobs critiques, UI admin pour retry manuel.

## Idempotence

\`Cache::lock()\` + vérification « déjà traité » avant action.

## Scheduler vs queue

Le scheduler doit dispatcher des jobs, pas exécuter tout sur un seul serveur.

## Conclusion

Les files ne sont pas un détail. C'est la **colonne vertébrale de la fiabilité**.`,
  },

  'api-idempotency-webhooks': {
    ar: `في نظام دفع حقيقي، السؤال ليس « هل سيُرسل العميل نفس الطلب مرتين؟ » بل « **متى** سيُرسله مرتين؟ »

انقطاع الشبكة، زر مزدوج، إعادة محاولة تلقائية من الموبايل، webhook متأخر من البوابة — كلها سيناريوهات يومية.

## Idempotency Key: العقد بين العميل والخادم

الفكرة: العميل يولّد مفتاحًا فريدًا لكل عملية منطقية، ويرسله مع الطلب. الخادم يضمن أن نفس المفتاح = نفس النتيجة، مهما تكرر الطلب.

\`\`\`http
POST /api/v1/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "amount": 15000,
  "currency": "SAR",
  "order_id": "ORD-2026-0042"
}
\`\`\`

### دورة حياة المفتاح

1. **طلب أول** — الخادم يبدأ معاملة، يسجّل المفتاح بحالة \`processing\`
2. **طلب مكرر (نفس المفتاح، نفس الجسم)** — يُعاد نفس الرد (200/201) دون إعادة التنفيذ
3. **طلب مكرر (نفس المفتاح، جسم مختلف)** — 409 Conflict
4. **انتهاء الصلاحية** — بعد 24–72 ساعة، المفتاح يُحذف

\`\`\`php
DB::transaction(function () use ($key, $payload) {
    $existing = IdempotencyKey::lockForUpdate()->find($key);

    if ($existing) {
        if ($existing->request_hash !== hash('sha256', json_encode($payload))) {
            throw new IdempotencyConflictException();
        }
        return $existing->response;
    }

    $result = $this->processPayment($payload);

    IdempotencyKey::create([
        'key' => $key,
        'request_hash' => hash('sha256', json_encode($payload)),
        'response' => $result,
        'status' => 'completed',
    ]);

    return $result;
});
\`\`\`

## Webhooks: العالم المقلوب

مع REST API، العميل يتحكم بالتوقيت. مع Webhooks، **الخادم الخارجي يقرر متى يرسل**.

### المشاكل الحقيقية

- **تسليم مكرر** — نفس الحدث 3 مرات
- **تسليم متأخر** — حدث قبل أسبوع يصل اليوم
- **ترتيب خاطئ** — \`payment.completed\` قبل \`payment.pending\`
- **توقيع غير صالح** — هجوم أو خطأ في المفتاح

### نموذج المعالجة الآمن

\`\`\`php
public function handle(Request $request)
{
    $this->verifySignature($request);

    $eventId = $request->input('event_id');
    $eventType = $request->input('type');

    if (ProcessedWebhook::where('event_id', $eventId)->exists()) {
        return response()->json(['status' => 'already_processed']);
    }

    ProcessWebhookJob::dispatch($eventId, $eventType, $request->all())
        ->onQueue('webhooks');

    return response()->json(['status' => 'accepted'], 202);
}
\`\`\`

**قاعدة ذهبية:** الرد على Webhook خلال 5 ثوانٍ. المعالجة الثقيلة في Job.

### ترتيب الأحداث

لا تعتمد على الترتيب. استخدم **حالة آلة (state machine)**:

\`\`\`
pending → processing → completed
                   → failed
                   → refunded
\`\`\`

حدث \`completed\` لوصل قبل \`pending\`؟ خزّنه، طبّقه عندما تصبح الحالة مناسبة، أو ارفض إذا كانت انتقالًا غير قانوني.

## التسوية (Reconciliation)

حتى مع idempotency مثالي، **الدفاتر يجب أن تتطابق**.

مهمة مجدولة يوميًا:
1. جلب كل المعاملات من بوابة الدفع (آخر 48 ساعة)
2. مقارنتها بسجلاتنا
3. تنبيه عند اختلاف (مبلغ، حالة، معاملة مفقودة)

هذا أنقذني أكثر من مرة عندما فشل webhook دون أن نلاحظ.

## أخطاء شائعة

| الخطأ | النتيجة |
|-------|---------|
| Idempotency key في body بدل header | تسرب في logs |
| عدم تخزين الرد الأصلي | طلب مكرر يُعيد تنفيذ |
| معالجة webhook متزامنة | timeout + retry = تكرار |
| عدم التحقق من التوقيع | ثغرة أمنية |

## الخلاصة

**Exactly-once** وهم في الأنظمة الموزعة. الهدف الواقعي: **at-least-once delivery + idempotent processing = effectively once**.

صمّم لذلك من اليوم الأول — إضافته لاحقًا أغلى بمراتب.`,

    en: `In a real payment system, the question isn't "will the client send the same request twice?" but "**when** will they?"

Network drops, double-clicks, mobile auto-retry, late gateway webhooks — all daily scenarios.

## Idempotency Key: the contract

The client generates a unique key per logical operation. The server guarantees the same key = same result, no matter how many times the request arrives.

### Key lifecycle

1. **First request** — server starts transaction, records key as \`processing\`
2. **Duplicate (same key, same body)** — return same response without re-execution
3. **Duplicate (same key, different body)** — 409 Conflict
4. **Expiry** — delete key after 24–72 hours

Use \`lockForUpdate()\` and store request hash + response.

## Webhooks: the inverted world

With REST, the client controls timing. With webhooks, **the external server decides when to send**.

### Real problems

- **Duplicate delivery** — same event 3 times
- **Late delivery** — week-old event arrives today
- **Wrong order** — \`completed\` before \`pending\`
- **Invalid signature** — attack or key mismatch

### Safe handling pattern

Verify signature → check \`event_id\` deduplication → dispatch to queue → return 202 within 5 seconds.

**Golden rule:** respond to webhooks in under 5 seconds. Heavy processing in a job.

### Event ordering

Don't rely on order. Use a **state machine**. Store out-of-order events and apply when state allows.

## Reconciliation

Even with perfect idempotency, **ledgers must match**.

Daily scheduled job:
1. Fetch gateway transactions (last 48h)
2. Compare with our records
3. Alert on mismatch

This saved me more than once when a webhook failed silently.

## Conclusion

**Exactly-once** is an illusion in distributed systems. The realistic goal: **at-least-once delivery + idempotent processing = effectively once**.

Design for it on day one — adding it later is orders of magnitude more expensive.`,

    fr: `Dans un vrai système de paiement, la question n'est pas « le client enverra-t-il deux fois ? » mais « **quand** ».

Coupures réseau, double-clic, retry mobile, webhooks tardifs — quotidien.

## Clé d'idempotence

Le client génère une clé unique. Le serveur garantit : même clé = même résultat.

Cycle : premier traitement → doublon même corps = même réponse → corps différent = 409 → expiration après 24–72h.

## Webhooks

Le serveur externe décide du timing.

Problèmes : livraison dupliquée, tardive, ordre incorrect, signature invalide.

Pattern : vérifier signature → dédupliquer par \`event_id\` → queue → 202 en < 5 secondes.

Machine à états pour l'ordre des événements.

## Réconciliation

Job quotidien : comparer transactions passerelle vs nos enregistrements.

## Conclusion

**Exactly-once** est une illusion. Objectif réaliste : **at-least-once + traitement idempotent**.`,
  },

  'laravel-rbac-enterprise': {
    ar: `\`@can('edit-post')\` يعمل بشكل رائع لمدوّنة. منصة مؤسسية بـ 15 دورًا، 200 صلاحية، وفرق متعددة؟ تتحول إلى كابوس.

## متى يكسر RBAC البسيط؟

- **صلاحيات على مستوى المورد:** « يحرر فقط فعالياته »
- **تفويض مؤقت:** « مدير الإقليم يوافق نيابة عن المدير العام لأسبوع »
- **سياق ديناميكي:** « يشاهد التقارير المالية لفرعه فقط »
- **تدقيق:** « من غيّر صلاحيات هذا المستخدم؟ »

## الطبقات الثلاث

### 1. الأدوار (Roles) — للتجميع فقط

الدور \`event-manager\` يجمع صلاحيات. لا يُنفّذ منطقًا.

### 2. الصلاحيات (Permissions) — أفعال ذرية

\`events.create\`, \`events.update.own\`, \`events.update.any\`, \`reports.financial.view\`

التسمية: \`resource.action.scope\`

### 3. السياسات (Policies) — المنطق المعقد

\`\`\`php
class EventPolicy
{
    public function update(User $user, Event $event): bool
    {
        if ($user->can('events.update.any')) {
            return true;
        }

        if ($user->can('events.update.own')) {
            return $event->created_by === $user->id
                && $event->tenant_id === $user->tenant_id;
        }

        return false;
    }
}
\`\`\`

## نطاق المستأجر + RBAC

في SaaS متعدد المستأجرين، الصلاحية بدون سياق المستأجر عديمة الفائدة.

\`\`\`php
// Middleware: SetPermissionsTeamId (spatie/laravel-permission)
app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);
\`\`\`

كل استعلام صلاحية يُفلتر تلقائيًا بالمستأجر.

## التفويض المؤقت

\`\`\`php
// delegations table
// delegator_id, delegate_id, permission, starts_at, ends_at
\`\`\`

عند التحقق:

\`\`\`php
public function hasDelegatedPermission(User $user, string $permission): bool
{
    return Delegation::active()
        ->where('delegate_id', $user->id)
        ->where('permission', $permission)
        ->exists();
}
\`\`\`

## التدقيق: غير قابل للتفاوض

كل تغيير صلاحية يُسجّل:

\`\`\`php
PermissionAudit::create([
    'actor_id' => auth()->id(),
    'target_user_id' => $target->id,
    'action' => 'granted',
    'permission' => 'events.delete.any',
    'ip' => request()->ip(),
]);
\`\`\`

في منصات الامتثال، هذا ليس رفاهية — إنه متطلب.

## أداء التحقق من الصلاحيات

200 صلاحية × 50 طلب/ثانية = كارثة إذا كل طلب يستعلم قاعدة البيانات.

**الحلول:**
- Cache صلاحيات المستخدم (TTL 5–15 دقيقة، إبطال عند التغيير)
- Eager load في بداية الطلب
- \`Gate::before()\` للـ super-admin فقط — ليس لكل صلاحية

## أخطاء شائعة

| الخطأ | البديل |
|-------|--------|
| \`if ($user->role === 'admin')\` في 40 مكان | Policy مركزية |
| صلاحيات في JWT طويل العمر | تحقق من DB أو cache قصير |
| أدوار متداخلة بلا حدود | تسلسل هرمي واضح + ممنوع الدورين المتعارضين |
| نسيان صلاحيات الـ API | نفس Policies للـ web والـ API |

## الخلاصة

RBAC المؤسسي = أدوار للتجميع + صلاحيات ذرية + سياسات للمنطق + تدقيق للامتثال.

ابنِ الطبقات من البداية. إضافة Policy لاحقًا على 200 controller = مشروع بحد ذاته.`,

    en: `\`@can('edit-post')\` works great for a blog. An enterprise platform with 15 roles, 200 permissions, and multiple teams? It becomes a nightmare.

## When simple RBAC breaks

- **Resource-level permissions:** "edit only their own events"
- **Temporary delegation:** "regional manager approves on behalf of GM for a week"
- **Dynamic context:** "view financial reports for their branch only"
- **Audit:** "who changed this user's permissions?"

## Three layers

### 1. Roles — grouping only

Role \`event-manager\` bundles permissions. It doesn't execute logic.

### 2. Permissions — atomic actions

\`events.create\`, \`events.update.own\`, \`events.update.any\`, \`reports.financial.view\`

Naming: \`resource.action.scope\`

### 3. Policies — complex logic

Policies handle own vs any, tenant context, and business rules.

## Tenant scope + RBAC

In multi-tenant SaaS, permissions without tenant context are useless. Use team-scoped permissions (e.g. spatie/laravel-permission with team ID).

## Temporary delegation

\`delegations\` table with \`delegator_id\`, \`delegate_id\`, \`permission\`, \`starts_at\`, \`ends_at\`.

## Audit: non-negotiable

Every permission change logged with actor, target, action, IP.

## Performance

200 permissions × 50 req/s = disaster if every request hits DB.

Solutions: cache user permissions (5–15 min TTL), eager load at request start, \`Gate::before()\` only for super-admin.

## Conclusion

Enterprise RBAC = roles for grouping + atomic permissions + policies for logic + audit for compliance.

Build layers from day one. Adding policies to 200 controllers later is a project in itself.`,

    fr: `\`@can('edit-post')\` convient à un blog. Une plateforme d'entreprise avec 15 rôles et 200 permissions ? Cauchemar.

## Quand le RBAC simple casse

Permissions par ressource, délégation temporaire, contexte dynamique, audit.

## Trois couches

1. **Rôles** — regroupement
2. **Permissions** — actions atomiques (\`resource.action.scope\`)
3. **Policies** — logique complexe

## Tenant + RBAC

Permissions sans contexte tenant inutiles en SaaS multi-tenant.

## Délégation temporaire

Table \`delegations\` avec dates de validité.

## Audit

Chaque changement de permission journalisé.

## Performance

Cache des permissions, eager load, \`Gate::before()\` limité au super-admin.

## Conclusion

RBAC entreprise = rôles + permissions atomiques + policies + audit. Construire les couches dès le départ.`,
  },

  'database-sagas-laravel': {
    ar: `طلب واحد من المستخدم: « سجّل في الدورة، ادفع، أرسل تأكيدًا بالبريد، أضفه لمجموعة الواتساب ».

في Monolith بسيط: \`DB::transaction()\` وتنتهي. في منصة حقيقية: 4 خدمات، 3 قواعد بيانات، بوابة دفع خارجية — **لا معاملة ACID واحدة تغطي كل هذا**.

## لماذا Two-Phase Commit فشل في الويب؟

2PC يتطلب أن كل المشاركين يقفلون الموارد حتى يقرروا. بوابة دفع خارجية لن تقفل جدولك. خدمة بريد لن تنتظر commit قاعدة بياناتك.

البديل العملي: **Saga** — سلسلة معاملات محلية، كل واحدة قابلة للتعويض.

## Orchestration vs Choreography

### Orchestration (منسّق مركزي)

خدمة واحدة تقود التدفق:

\`\`\`
OrderSaga:
  1. CreateEnrollment → نجاح
  2. ChargePayment → نجاح
  3. SendEmail → فشل
  4. Compensate: RefundPayment
  5. Compensate: DeleteEnrollment
\`\`\`

\`\`\`php
class EnrollAndPaySaga
{
    public function execute(EnrollRequest $request): void
    {
        $enrollment = null;
        $payment = null;

        try {
            $enrollment = $this->enrollmentService->create($request);
            $payment = $this->paymentService->charge($request, $enrollment);
            $this->notificationService->sendConfirmation($enrollment);
        } catch (NotificationException $e) {
            if ($payment) $this->paymentService->refund($payment);
            if ($enrollment) $this->enrollmentService->cancel($enrollment);
            throw $e;
        }
    }
}
\`\`\`

**مناسب لـ:** تدفقات معقدة، فريق واحد، حاجة لرؤية واضحة للحالة.

### Choreography (رقصة أحداث)

كل خدمة تستمع وتحدث:

\`\`\`
EnrollmentCreated → PaymentService يشحن
PaymentCompleted → NotificationService يرسل
PaymentFailed → EnrollmentService يلغي
\`\`\`

**مناسب لـ:** فرق مستقلة، توسع أفقي، فك ارتباط الخدمات.

**العيب:** صعب تتبع التدفق، خطر الحلقات، debugging أصعب.

## تنفيذ Saga في Laravel عمليًا

### جدول saga_instances

\`\`\`sql
CREATE TABLE saga_instances (
    id UUID PRIMARY KEY,
    type VARCHAR(100),
    status ENUM('running','completed','compensating','failed'),
    current_step INT,
    payload JSON,
    created_at TIMESTAMP
);
\`\`\`

### كل خطوة = Job

\`\`\`php
class SagaStepJob implements ShouldQueue
{
    public function handle(): void
    {
        $saga = SagaInstance::find($this->sagaId);

        match ($saga->current_step) {
            1 => $this->stepCreateEnrollment($saga),
            2 => $this->stepChargePayment($saga),
            3 => $this->stepSendNotification($saga),
        };
    }

    public function failed(Throwable $e): void
    {
        CompensateSagaJob::dispatch($this->sagaId);
    }
}
\`\`\`

## التعويض (Compensation)

ليست \`rollback\` — بل **إجراء معاكس**:

| الخطوة | التعويض |
|--------|---------|
| إنشاء تسجيل | حذف/إلغاء التسجيل |
| خصم مبلغ | استرداد |
| إرسال بريد | إرسال بريد إلغاء (لا يمكن «unsend») |
| إنشاء فاتورة | إشعار دائن |

**قاعدة:** كل خطوة يجب أن يكون لها تعويض محدد مسبقًا — أو تُعلَّم كـ «غير قابلة للتعويض» بوعي.

## الاتساق النهائي (Eventual Consistency)

بين الخطوة 2 و3، الحالة «مدفوع لكن لم يُرسل تأكيد». المستخدم قد يرى هذا.

**التعامل:**
- UI تعرض حالة وسيطة: «جارٍ إتمام التسجيل »
- Polling أو WebSocket للتحديث
- مهمة reconciliation تكتشف الحالات العالقة

## Outbox Pattern: لا تفقد الأحداث

\`\`\`php
DB::transaction(function () use ($enrollment) {
    $enrollment->save();

    OutboxEvent::create([
        'aggregate_type' => 'enrollment',
        'aggregate_id' => $enrollment->id,
        'event_type' => 'EnrollmentCreated',
        'payload' => $enrollment->toArray(),
    ]);
});
\`\`\`

Worker منفصل ينشر أحداث Outbox إلى الطابور — مضمون التسليم حتى لو تعطل الناشر.

## متى لا تحتاج Saga؟

- عملية في خدمة واحدة + قاعدة واحدة → \`DB::transaction()\`
- فشل غير حرج (إرسال بريد) → fire-and-forget مع retry
- قراءة فقط → لا saga

Saga لـ **عمليات حرجة متعددة الخطوات عبر حدود خدمية**.

## الخلاصة

الأنظمة الموزعة لا تمنحك ACID عبر الخدمات. تمنحك **خيارات**:

1. **Saga orchestrated** — تحكم، وضوح، تعقيد مركزي
2. **Saga choreographed** — فك ارتباط، تعقيد توزيعي
3. **Outbox** — ضمان عدم فقدان الأحداث

اختر بوعي. وثّق التعويضات. اختبر مسارات الفشل — لأنها **ستحدث**.`,

    en: `One user request: "enroll in the course, pay, send email confirmation, add to WhatsApp group."

In a simple monolith: \`DB::transaction()\` and done. In a real platform: 4 services, 3 databases, external payment gateway — **no single ACID transaction covers this**.

## Why Two-Phase Commit fails on the web

2PC requires all participants to lock resources until decision. An external payment gateway won't lock your table. An email service won't wait for your DB commit.

Practical alternative: **Saga** — a chain of local transactions, each compensatable.

## Orchestration vs Choreography

### Orchestration (central coordinator)

One service drives the flow. Clear visibility. Good for complex flows, single team.

### Choreography (event dance)

Each service listens and reacts. Good for independent teams, horizontal scale. Harder to trace and debug.

## Implementing Saga in Laravel

### saga_instances table

Track \`type\`, \`status\`, \`current_step\`, \`payload\`.

### Each step = Job

On failure, dispatch \`CompensateSagaJob\`.

## Compensation

Not rollback — **inverse action**:

| Step | Compensation |
|------|--------------|
| Create enrollment | Delete/cancel enrollment |
| Charge payment | Refund |
| Send email | Send cancellation email (can't "unsend") |
| Create invoice | Credit note |

Every step needs a predefined compensation — or be explicitly marked non-compensatable.

## Eventual consistency

Between step 2 and 3, state is "paid but no confirmation sent." User may see this.

Handle with intermediate UI state, polling/WebSocket, reconciliation for stuck states.

## Outbox Pattern

Save business data + outbox event in same DB transaction. Separate worker publishes to queue — guaranteed delivery even if publisher crashes.

## When you don't need Saga

- Single service + single DB → \`DB::transaction()\`
- Non-critical failure (email) → fire-and-forget with retry
- Read-only → no saga

Saga for **critical multi-step operations across service boundaries**.

## Conclusion

Distributed systems don't give you ACID across services. They give you **choices**:

1. Orchestrated saga — control, clarity, central complexity
2. Choreographed saga — decoupling, distributed complexity
3. Outbox — guaranteed event delivery

Choose consciously. Document compensations. Test failure paths — because they **will happen**.`,

    fr: `Une requête utilisateur : s'inscrire, payer, recevoir un email, rejoindre un groupe.

En monolithe : \`DB::transaction()\`. En plateforme réelle : 4 services, 3 bases, passerelle externe — **pas de transaction ACID unique**.

## Pourquoi 2PC échoue sur le web

Le 2PC exige que tous verrouillent. Une passerelle de paiement externe n'attendra pas votre commit.

Alternative : **Saga** — chaîne de transactions locales compensables.

## Orchestration vs Choreography

**Orchestration** — coordinateur central, visibilité, flux complexes.

**Choreography** — chaque service réagit aux événements, équipes indépendantes, debug plus dur.

## Implémentation Laravel

Table \`saga_instances\`, chaque étape = Job, échec → \`CompensateSagaJob\`.

## Compensation

Pas un rollback — action inverse documentée pour chaque étape.

## Cohérence finale

État intermédiaire visible par l'utilisateur. UI « en cours », polling, réconciliation.

## Outbox Pattern

Données + événement outbox dans la même transaction DB. Worker séparé pour publication garantie.

## Conclusion

Pas d'ACID cross-services. Choix conscients : saga orchestrée, choreographiée, outbox. Tester les chemins d'échec.`,
  },
};

for (const [slug, locales] of Object.entries(articles)) {
  for (const [locale, meta] of Object.entries(locales)) {
    const body = bodies[slug][locale];
    const quote = (s) => JSON.stringify(s);
    const frontmatter = [
      '---',
      `title: ${quote(meta.title)}`,
      `excerpt: ${quote(meta.excerpt)}`,
      `category: ${quote(meta.category)}`,
      `publishedAt: ${meta.publishedAt}`,
      `readingTime: ${meta.readingTime}`,
      'tags:',
      ...meta.tags.map((t) => `  - ${t}`),
      `cover: /images/articles/${slug}.svg`,
      `translationOf: ${slug}`,
      '---',
      '',
      body,
      '',
    ].join('\n');

    const path = join(ROOT, `content/articles/${locale}/${slug}.md`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, frontmatter);
    console.log(`Wrote ${path}`);
  }
}

console.log('Done generating articles.');
