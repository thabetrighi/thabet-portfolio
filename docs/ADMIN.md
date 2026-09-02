# لوحة التحكم — Admin Panel

لوحة إدارة محمية على `/admin` لإدارة المحتوى عبر **GitHub** مع نشر تلقائي عبر **GitHub Actions**.

## البنية

```
data/
├── config/site.json, social.json
└── profile/{ar,en,fr}.json

content/
├── articles/{ar,en,fr}/*.md
└── projects/{ar,en,fr}/*.md

src/lib/admin/
├── auth/          # جلسات، كلمة مرور، حماية API
├── github/        # عميل GitHub + عمليات المحتوى
├── api/           # مساعدات الاستجابة
├── markdown.ts    # تحليل/توليد frontmatter
└── config.ts      # مسارات وثوابت

src/pages/admin/   # واجهة اللوحة
src/pages/api/admin/  # REST API
```

## الإعداد (مرة واحدة)

### 1. GitHub Personal Access Token

أنشئ token بصلاحيات:
- `repo` (للكتابة على المستودع)
- `workflow` (لتشغيل النشر)

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put GITHUB_OWNER      # مثال: thabet-righi
npx wrangler secret put GITHUB_REPO       # اسم المستودع
npx wrangler secret put GITHUB_BRANCH     # main
```

### 2. كلمة مرور اللوحة

```bash
node scripts/generate-admin-hash.mjs "كلمة-مرور-قوية"
npx wrangler secret put ADMIN_PASSWORD_HASH
# أو مؤقتاً:
npx wrangler secret put ADMIN_PASSWORD
```

### 3. أسرار GitHub Actions

في GitHub → Settings → Secrets:

| Secret | الوصف |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | نشر Workers |
| `CLOUDFLARE_ACCOUNT_ID` | معرف الحساب |
| `PUBLIC_TURNSTILE_SITE_KEY` | مفتاح Turnstile العام |
| `TURNSTILE_SECRET_KEY` | مفتاح Turnstile السري |
| `ADMIN_PASSWORD` | كلمة مرور اللوحة |
| `ADMIN_GITHUB_TOKEN` | نفس GITHUB_TOKEN |
| `GITHUB_OWNER` | مالك المستودع |
| `GITHUB_REPO` | اسم المستودع |

### 4. النشر

```bash
npm run build && npx wrangler deploy
```

## الاستخدام

1. افتح **https://thabetrighi.com/admin**
2. سجّل الدخول (كلمة المرور + Turnstile)
3. عدّل المقالات / المشاريع / الإعدادات
4. اذهب إلى **النشر** → **نشر الآن**

كل حفظ = commit على GitHub. النشر = تشغيل workflow.

## الحماية

| الطبقة | التفاصيل |
|--------|----------|
| Turnstile | على تسجيل الدخول |
| Session | KV + cookie HttpOnly |
| Rate limit | 10 محاولات دخول/دقيقة، 60 طلب API/دقيقة |
| Middleware | حماية `/admin` و `/api/admin` |
| noindex | لوحة التحكم غير مفهرسة |

## التوسعة

- أضف نماذج جديدة في `src/pages/admin/`
- أضف API في `src/pages/api/admin/`
- أضف عمليات GitHub في `src/lib/admin/github/content.ts`
- البيانات الجديدة → ملفات JSON تحت `data/`
