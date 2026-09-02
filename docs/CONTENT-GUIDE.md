# دليل تعديل المحتوى والبيانات

دليل عملي لتعديل بيانات الموقع — الاسم، الشعار، المقالات، المشاريع، الخبرات، والنصوص — **بدون تعديل مكونات الواجهة**.

---

## فهرس سريع

| ماذا تريد تعديله؟ | الملف |
|-------------------|-------|
| الاسم، البريد، الروابط، الشعار | `src/lib/site.ts` |
| **روابط التواصل الاجتماعي + الأيقونات** | `src/lib/social.ts` |
| نصوص الواجهة (أزرار، عناوين أقسام) | `src/i18n/ui.ts` |
| الخبرات، المهارات، السيرة، نبذة About | `src/lib/content.ts` |
| مقال جديد | `content/articles/{ar,en,fr}/` |
| مشروع جديد | `content/projects/{ar,en,fr}/` |
| صور، شعار، CV، favicon | `public/` |
| رابط الموقع (SEO) | `astro.config.mjs` |
| ألوان وخطوط | `src/styles/global.css` |
| متغيرات البيئة (بريد التواصل، Turnstile) | `.env` |

---

## 1. الهوية الأساسية — `src/lib/site.ts`

هذا الملف المركزي لبياناتك الشخصية والروابط.

```typescript
export const site = {
  name: 'Thabet',                    // اسم قصير (SEO، metadata)
  fullName: {
    ar: 'ثابت',                      // الاسم في الواجهة العربية
    en: 'Thabet',
    fr: 'Thabet',
  },
  logo: '',                          // مسار الشعار — اتركه فارغًا للنص فقط
  email: 'contact@thabetrighi.com',
  url: 'https://thabetrighi.com',         // يجب أن يطابق نطاقك الفعلي
  github: 'https://github.com/thabet',
  linkedin: 'https://linkedin.com/in/thabet',
  twitter: 'https://x.com/thabet',
} as const;
```

### إضافة شعار

1. ضع ملف الشعار في `public/images/logo.svg` (أو `.png` / `.webp`)
2. عيّن المسار:

```typescript
logo: '/images/logo.svg',
```

3. يظهر الشعار بجانب الاسم في الـ header تلقائيًا.

### التواصل الاجتماعي — `src/lib/social.ts`

```typescript
{ platform: 'github', url: 'https://github.com/username' },
{ platform: 'facebook', url: '' },  // فارغ = مخفي
```

المنصات: `github` · `gitlab` · `linkedin` · `facebook` · `x` · `instagram` · `youtube` · `stackoverflow` · `devto` · `medium`

### Favicon (أيقونة التبويب)

استبدل الملفات في `public/`:
- `public/favicon.svg` — الأفضل (متجهي)
- `public/favicon.ico` — للمتصفحات القديمة

### صورة المشاركة (Open Graph)

استبدل `public/og/default.svg` أو أضف صورة جديدة وعدّل المسار الافتراضي في `src/layouts/BaseLayout.astro` إذا لزم.

---

## 2. نصوص الواجهة — `src/i18n/ui.ts`

كل النصوص الظاهرة في الأزرار والعناوين والأقسام موجودة هنا بثلاث لغات: `ar`، `en`، `fr`.

```typescript
hero: {
  identity: 'Software Engineer building...',
  description: '...',
  ctaWork: 'View my work',
  // ...
},
stats: {
  years: { value: '8+', label: 'Years experience' },
  // ...
},
```

**قاعدة:** عند تعديل نص في `en`، عدّل المقابل في `ar` و `fr` للحفاظ على تناسق اللغات.

### إضافة لغة جديدة

1. أضف الرمز في `src/i18n/config.ts` → `locales`
2. أضف ترجمة كاملة في `ui.ts`
3. أنشئ مجلدات محتوى `content/articles/xx/` و `content/projects/xx/`
4. سجّل المجموعة في `src/content.config.ts`

---

## 3. الخبرات والمهارات والسيرة — `src/lib/content.ts`

### الخبرات المهنية

ابحث عن `experience` وعدّل المصفوفة لكل لغة:

```typescript
{
  company: 'TechFlow SaaS',
  position: 'Senior Software Engineer',
  startDate: '2022',
  endDate: null,              // null = "الحاضر" / "Present"
  location: 'Remote',
  description: '...',
  technologies: ['Laravel', 'PostgreSQL'],
  achievements: ['...', '...'],
}
```

### المهارات

```typescript
skills: {
  en: [
    { name: 'Backend', items: ['Laravel', 'PHP', 'Node.js'] },
    // ...
  ],
}
```

### نبذة About

```typescript
about: {
  en: {
    summary: 'نص قصير للصفحة الرئيسية',
    extended: 'نص أطول لصفحة About — افصل الفقرات بـ \\n\\n',
  },
}
```

### السيرة الذاتية (Resume)

```typescript
resume: {
  en: {
    profile: '...',
    education: [{ institution, degree, period, location }],
    certifications: [{ name, issuer, year }],
    languages: [{ language, level }],
    cvFiles: { en: '/cv/thabet-cv-en.pdf', ar: '...', fr: '...' },
  },
}
```

ضع ملفات PDF في `public/cv/`.

---

## 4. المقالات — `content/articles/`

### هيكل المجلد

```
content/articles/
├── ar/
│   └── my-article.md
├── en/
│   └── my-article.md
└── fr/
    └── my-article.md
```

### إضافة مقال جديد (خطوة بخطوة)

**1.** أنشئ الملف بالإنجليزية:

`content/articles/en/building-apis.md`

```markdown
---
title: Building APIs That Don't Break
excerpt: Practical patterns for stable API design at scale.
category: Architecture
publishedAt: 2026-03-15
readingTime: 7
tags:
  - APIs
  - Laravel
cover: /images/articles/building-apis.svg
draft: false
---

محتوى المقال بصيغة Markdown...

## عنوان فرعي

نص الفقرة.

\`\`\`typescript
const example = true;
\`\`\`
```

**2.** أضف الترجمة العربية (اختياري):

`content/articles/ar/building-apis.md`

```yaml
translationOf: building-apis   # يربطه بالنسخة الإنجليزية
```

**3.** ضع صورة الغلاف في `public/images/articles/building-apis.svg`

**4.** أعد البناء:

```bash
npm run build
```

### حقول frontmatter للمقال

| الحقل | مطلوب | الوصف |
|-------|--------|-------|
| `title` | ✅ | عنوان المقال |
| `excerpt` | ✅ | وصف قصير (SEO + قائمة المقالات) |
| `category` | ✅ | التصنيف |
| `publishedAt` | ✅ | تاريخ النشر `YYYY-MM-DD` |
| `readingTime` | ✅ | دقائق القراءة (رقم) |
| `tags` | ✅ | قائمة وسوم |
| `cover` | ❌ | مسار صورة الغلاف |
| `translationOf` | ❌ | slug المقال الأصلي للربط بين اللغات |
| `draft` | ❌ | `true` لإخفاء المقال (افتراضي: `false`) |

### الرابط الناتج

```
/en/articles/building-apis
/ar/articles/building-apis
```

اسم الملف (بدون `.md`) = الـ slug في الرابط.

---

## 5. المشاريع — `content/projects/`

### إضافة مشروع جديد

`content/projects/en/my-saas.md`

```markdown
---
title: My SaaS Platform
excerpt: Short one-line description.
problem: What problem did it solve?
solution: How did you solve it?
role: Lead Developer — architecture, backend
result: Measurable impact (numbers help).
technologies:
  - Laravel
  - Vue.js
  - PostgreSQL
cover: /images/projects/my-saas.svg
order: 5
featured: true
github: https://github.com/you/project
demo: https://demo.example.com
draft: false
---

## Approach

تفاصيل إضافية لصفحة Case Study (Markdown)...
```

### حقول frontmatter للمشروع

| الحقل | مطلوب | الوصف |
|-------|--------|-------|
| `title` | ✅ | اسم المشروع |
| `excerpt` | ✅ | وصف قصير |
| `problem` | ✅ | المشكلة |
| `solution` | ✅ | الحل |
| `role` | ✅ | دورك |
| `result` | ✅ | النتيجة / الأثر |
| `technologies` | ✅ | قائمة تقنيات |
| `cover` | ✅ | صورة المشروع |
| `order` | ✅ | ترتيب العرض (`1` = أول مشروع) |
| `featured` | ❌ | يظهر في الصفحة الرئيسية (افتراضي: `true`) |
| `github` | ❌ | رابط GitHub |
| `demo` | ❌ | رابط العرض المباشر |
| `translationOf` | ❌ | slug المشروع الأصلي |
| `draft` | ❌ | `true` لإخفاء المشروع |

### الرابط الناتج

```
/en/work/my-saas
```

---

## 6. الملفات الثابتة — `public/`

```
public/
├── favicon.svg              # أيقونة التبويب
├── favicon.ico
├── robots.txt
├── og/
│   └── default.svg          # صورة المشاركة الافتراضية
├── cv/
│   ├── thabet-cv-ar.pdf
│   ├── thabet-cv-en.pdf
│   └── thabet-cv-fr.pdf
└── images/
    ├── logo.svg             # الشعار (إن وُجد)
    ├── articles/            # صور المقالات
    └── projects/            # صور المشاريع
```

**قاعدة:** أي ملف في `public/` يُعرض مباشرة على `/images/...` بدون إعادة بناء المحتوى — لكن إعادة النشر مطلوبة على Cloudflare.

---

## 7. SEO وإعدادات الموقع

### رابط الموقع الأساسي

`astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://thabetrighi.com',  // ← غيّره لنطاقك
  // ...
});
```

يُستخدم في: canonical URLs، sitemap، Open Graph، RSS.

### بعد أي تعديل

```bash
npm run build          # تحقق محليًا
npm run preview        # معاينة
npx wrangler deploy    # نشر على Cloudflare
```

---

## 8. متغيرات البيئة — `.env`

```bash
PUBLIC_TURNSTILE_SITE_KEY=...   # مفتاح عام (واجهة)
TURNSTILE_SECRET_KEY=...        # سري — Cloudflare dashboard فقط
CONTACT_EMAIL=contact@thabetrighi.com    # مستلم نموذج التواصل (أو righithabt@gmail.com)
```

انسخ من `.env.example`. **لا ترفع `.env` إلى Git.**

---

## 9. سيناريوهات شائعة

### تغيير الاسم فقط

1. `src/lib/site.ts` → `name` و `fullName`
2. `src/i18n/ui.ts` → `meta.homeTitle` لكل لغة
3. `npm run build && npx wrangler deploy`

### إضافة مقال بالعربية فقط

1. أنشئ `content/articles/ar/my-post.md` فقط
2. لا حاجة لملفات `en`/`fr` — لن يُختلق محتوى تلقائيًا
3. رابط الترجمات البديلة يظهر فقط للغات المتوفرة

### إخفاء مشروع مؤقتًا

```yaml
draft: true
```

### تغيير ترتيب المشاريع في الصفحة الرئيسية

عدّل `order` — الأرقام الأصغر تظهر أولًا.

### تغيير الألوان

`src/styles/global.css` → قسم `@theme`:

```css
--color-accent: #b84a2f;
--color-paper: #f6f4ef;
--color-paper-dark: #121110;
```

راجع أيضًا `docs/DESIGN-DIRECTION.md`.

---

## 10. خريطة الملفات الكاملة

```
src/
├── lib/
│   ├── site.ts          ← هوية + روابط + شعار
│   └── content.ts       ← خبرات + مهارات + سيرة + about
├── i18n/
│   ├── config.ts        ← اللغات واكتشاف المنطقة
│   └── ui.ts            ← كل نصوص الواجهة
├── content.config.ts    ← schema المقالات والمشاريع
├── layouts/
│   └── BaseLayout.astro ← SEO + خطوط + theme
└── styles/
    └── global.css       ← تصميم وألوان

content/
├── articles/{ar,en,fr}/*.md
└── projects/{ar,en,fr}/*.md

public/                  ← أصول ثابتة
docs/
├── DESIGN-DIRECTION.md
└── CONTENT-GUIDE.md     ← هذا الملف
```

---

## 11. التحقق بعد التعديل

- [ ] `npm run build` ينجح بدون أخطاء
- [ ] راجع الصفحة الرئيسية بثلاث لغات (`/ar` `/en` `/fr`)
- [ ] راجع الوضع الداكن والفاتح
- [ ] تحقق من الروابط الجديدة للمقالات/المشاريع
- [ ] انشر على Cloudflare

---

## أسئلة شائعة

**هل أحتاج تعديل Components عند إضافة مقال؟**  
لا. أضف ملف `.md` فقط.

**ماذا لو لم أترجم مقالًا؟**  
يظهر باللغة التي كتبته فقط. لا تُنشأ ترجمة تلقائية.

**كيف أغيّر نص زر "تواصل معي"؟**  
`src/i18n/ui.ts` → `hero.ctaContact` (لكل لغة).

**أين أعدّل إحصائيات الصفحة الرئيسية (8+ سنوات)؟**  
`src/i18n/ui.ts` → `stats`.
