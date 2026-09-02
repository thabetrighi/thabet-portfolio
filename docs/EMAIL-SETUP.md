# إعداد البريد: contact@thabetrighi.com → righithabt@gmail.com

تم تفعيل **Cloudflare Email Routing** على النطاق `thabetrighi.com` وسجلات MX جاهزة.  
تبقى خطوة واحدة يدوية في لوحة Cloudflare (لا يمكن إكمالها عبر API Token الحالي).

## الخطوات في لوحة Cloudflare

1. افتح [Cloudflare Dashboard](https://dash.cloudflare.com) → اختر **thabetrighi.com**
2. من القائمة الجانبية: **Email** → **Email Routing**
3. **Destination addresses** → **Add destination address**
   - أدخل: `righithabt@gmail.com`
   - افتح Gmail واضغط رابط التأكيد الذي يرسله Cloudflare
4. **Routing rules** → **Create address**
   - **Custom address:** `contact`
   - **Action:** Send to → `righithabt@gmail.com`
   - احفظ القاعدة
5. (اختياري) كرّر للعناوين الأخرى مثل `hello@` أو `info@`

## التحقق

- أرسل رسالة اختبار من Gmail إلى `contact@thabetrighi.com`
- يجب أن تصل إلى `righithabt@gmail.com` خلال دقائق

## نموذج التواصل في الموقع

العنوان المعروض على الموقع: `contact@thabetrighi.com`

نموذج التواصل (`/contact`) لا يرسل بريداً فعلياً بعد — يحتاج لاحقاً ربط **Email Workers** أو **Resend**.  
عند التفعيل، عيّن السر:

```bash
npx wrangler secret put CONTACT_EMAIL
# أدخل: righithabt@gmail.com
# أو contact@thabetrighi.com بعد تفعيل التوجيه
```

## سجلات DNS (تم إنشاؤها تلقائياً)

| النوع | الاسم | القيمة |
|-------|--------|--------|
| MX | thabetrighi.com | route1/2/3.mx.cloudflare.net |
| TXT | thabetrighi.com | SPF لـ Cloudflare Email |
| TXT | cf2024-1._domainkey | DKIM |

لا تحذف هذه السجلات وإلا سيتوقف التوجيه.
