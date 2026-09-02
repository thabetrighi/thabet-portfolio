# إعداد البريد: contact@thabetrighi.com → righithabt@gmail.com

تم تفعيل **Cloudflare Email Routing** و**Email Workers** على النطاق `thabetrighi.com`.

## ما يعمل الآن

| الميزة | الحالة |
|--------|--------|
| توجيه البريد الوارد `contact@` → Gmail | مفعّل |
| نموذج التواصل يرسل بريداً عبر Email Workers | مفعّل |
| المرسل: `contact@thabetrighi.com` | مضبوط |
| المستلم: `righithabt@gmail.com` | مضبوط |

## إعدادات Wrangler (تمت)

```jsonc
"send_email": [{
  "name": "EMAIL",
  "destination_address": "righithabt@gmail.com",
  "allowed_sender_addresses": ["contact@thabetrighi.com"]
}]
```

## اختبار نموذج التواصل

1. افتح https://thabetrighi.com/en/contact
2. املأ النموذج وأرسل
3. تحقق من وصول الرسالة إلى `righithabt@gmail.com`
4. الرد المباشر يذهب لبريد الزائر (عبر `replyTo`)

## Turnstile (اختياري — موصى به)

لتفعيل CAPTCHA في الإنتاج:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put PUBLIC_TURNSTILE_SITE_KEY
```

ثم أعد النشر: `npm run build && npx wrangler deploy`

## تغيير مستلم النموذج

```bash
npx wrangler secret put CONTACT_EMAIL
# أدخل البريد المطلوب (يجب أن يكون مُتحققاً في Email Routing)
```

## سجلات DNS (تلقائية)

| النوع | الاسم | القيمة |
|-------|--------|--------|
| MX | thabetrighi.com | route1/2/3.mx.cloudflare.net |
| TXT | thabetrighi.com | SPF لـ Cloudflare Email |
| TXT | cf2024-1._domainkey | DKIM |

لا تحذف هذه السجلات وإلا سيتوقف التوجيه.
