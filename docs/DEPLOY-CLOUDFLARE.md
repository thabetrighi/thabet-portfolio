# نشر الموقع على حساب Cloudflare الخاص بك

الموقع مبني على **Astro + Cloudflare Workers** (ليس Pages تقليدي). النشر يتم عبر **Wrangler**.

---

## ما الذي أحتاجه منك؟ (إذا أردت أن أنشره لك)

لا يمكن النشر على حسابك بدون صلاحيات. المطلوب:

| المطلوب | الوصف |
|---------|--------|
| **Cloudflare API Token** | مفتاح API بصلاحيات Workers |
| **Account ID** (اختياري) | يظهر في لوحة Cloudflare → Overview |
| **نطاقك** (اختياري) | مثل `thabetrighi.com` إن أردت ربطه مباشرة |

### إنشاء API Token

1. ادخل إلى [dash.cloudflare.com](https://dash.cloudflare.com)
2. **My Profile** → **API Tokens** → **Create Token**
3. **الأسهل:** اختر قالب **Edit Cloudflare Workers** كما هو (يمنح كل الصلاحيات المطلوبة)
4. **أو** أنشئ token مخصصًا بهذه الصلاحيات **كلها**:

| الصلاحية | المستوى |
|----------|---------|
| Account → Workers Scripts | **Edit** |
| Account → Workers KV Storage | **Edit** |
| Account → Workers R2 Storage | **Edit** |
| Account → Account Settings | **Read** |
| User → User Details | **Read** |
| User → Memberships | **Read** |
| Zone → Workers Routes | **Edit** (إذا ربطت نطاقًا) |

5. انسخ الـ Token — **لن يظهر مرة أخرى**

> إذا ظهر خطأ `Authentication error [code: 10000]` فالـ Token ناقص صلاحيات — أعد إنشاءه بالقالب أعلاه.

> **لا ترسل المفتاح في محادثة عامة.** الأفضل: أضفه كـ Secret في بيئة Cloud Agent أو نفّذ النشر بنفسك محليًا.

---

## الطريقة 1 — النشر من جهازك (موصى بها)

### المتطلبات

- Node.js 22+
- حساب Cloudflare
- Git clone للمشروع

### الخطوات

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تسجيل الدخول لحسابك
npx wrangler login
# يفتح المتصفح — سجّل الدخول ووافق

# 3. بناء الموقع
npm run build

# 4. النشر على Workers
npx wrangler deploy
```

بعد النشر ستحصل على رابط مثل:

```
https://thabet-portfolio.<account-subdomain>.workers.dev
```

### إعداد الأسرار (نموذج التواصل)

```bash
# بريد مستلم الرسائل
npx wrangler secret put CONTACT_EMAIL
# أدخل: your@email.com

# مفتاح Turnstile السري (من لوحة Cloudflare)
npx wrangler secret put TURNSTILE_SECRET_KEY
```

لمفتاح Turnstile العام (يظهر في الواجهة):

```bash
# في Cloudflare Dashboard → Workers → thabet-portfolio → Settings → Variables
# أضف:
PUBLIC_TURNSTILE_SITE_KEY = your_site_key
```

أو أنشئ `.env` محليًا قبل البناء:

```bash
PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### إنشاء Turnstile (حماية النموذج)

1. Cloudflare Dashboard → **Turnstile** → **Add site**
2. أضف نطاقك (أو `localhost` للتطوير)
3. انسخ **Site Key** → `PUBLIC_TURNSTILE_SITE_KEY`
4. انسخ **Secret Key** → `TURNSTILE_SECRET_KEY` (سرّي فقط)

---

## الطريقة 2 — ربط نطاق مخصص

### إذا النطاق على Cloudflare

1. **Workers & Pages** → **thabet-portfolio** → **Settings** → **Domains & Routes**
2. **Add** → **Custom Domain** → `thabetrighi.com` و `www.thabetrighi.com`
3. Cloudflare ينشئ DNS تلقائيًا

### إذا النطاق خارج Cloudflare

1. انقل DNS إلى Cloudflare (أضف الموقع كـ zone)
2. أو أضف CNAME يشير إلى `thabet-portfolio.<subdomain>.workers.dev`

### بعد ربط النطاق — عدّل في المشروع

**`astro.config.mjs`:**

```javascript
site: 'https://thabetrighi.com',  // نطاقك الفعلي
```

**`src/lib/site.ts`:**

```typescript
url: 'https://thabetrighi.com',
email: 'your@email.com',
```

ثم أعد البناء والنشر:

```bash
npm run build && npx wrangler deploy
```

---

## الطريقة 3 — النشر التلقائي عبر Git (CI/CD)

### Cloudflare Dashboard

1. **Workers & Pages** → **Create** → **Connect to Git**
2. اختر المستودع
3. إعدادات البناء:

| الإعداد | القيمة |
|---------|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | 22 |

4. أضف **Environment variables** و **Secrets** من لوحة التحكم

### GitHub Actions (بديل)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_TURNSTILE_SITE_KEY: ${{ secrets.PUBLIC_TURNSTILE_SITE_KEY }}
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

أضف في GitHub → **Settings** → **Secrets**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `PUBLIC_TURNSTILE_SITE_KEY`

---

## ماذا يحدث للنشر المؤقت الحالي؟

الموقع الحالي على:

```
https://thabet-portfolio.golden-pendulum.workers.dev
```

هذا على **حساب Cloudflare مؤقت**. عند النشر على حسابك:

- تحصل على رابط جديد تابع لحسابك
- الرابط القديم يتوقف عند انتهاء الحساب المؤقت
- المحتوى والكود نفسه — فقط الحساب يتغير

---

## قائمة تحقق بعد النشر

- [ ] `npx wrangler deploy` نجح
- [ ] الموقع يفتح على الرابط الجديد
- [ ] الوضع الداكن/الفاتح يعمل
- [ ] اللغات الثلاث تعمل (`/ar` `/en` `/fr`)
- [ ] `CONTACT_EMAIL` و Turnstile مضبوطان
- [ ] `astro.config.mjs` → `site` يطابق نطاقك
- [ ] النطاق المخصص مربوط (إن وُجد)
- [ ] SSL يعمل (تلقائي من Cloudflare)

---

## أوامر مفيدة

```bash
npm run build              # بناء
npm run preview            # معاينة محلية
npx wrangler deploy        # نشر
npx wrangler tail          # مراقبة logs مباشرة
npx wrangler secret list   # عرض الأسرار (بدون قيم)
npx wrangler whoami        # التحقق من الحساب المتصل
```

---

## مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| `Not authenticated` | `npx wrangler login` |
| CSS لا يظهر | تأكد من `npm run build` قبل deploy |
| النموذج لا يرسل | أضف `TURNSTILE_SECRET_KEY` و `CONTACT_EMAIL` |
| sitemap خاطئ | عدّل `site` في `astro.config.mjs` |

---

## تعديل اسم Worker

في `wrangler.jsonc`:

```json
"name": "thabet-portfolio"
```

غيّره إن أردت، مثل `"my-portfolio"`.
