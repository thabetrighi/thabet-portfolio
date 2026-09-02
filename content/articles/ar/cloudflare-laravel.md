---
title: نشر Laravel على Cloudflare Workers — ما يعمل فعلًا
excerpt: دليل عملي لتشغيل أحمال PHP/Laravel على الحافة، بما في ذلك ما يُنقل إلى Workers وما يبقى على البنية التقليدية.
category: البنية التحتية
publishedAt: 2026-01-20
readingTime: 6
tags:
  - Cloudflare
  - Laravel
  - Edge
cover: /images/articles/cloudflare-laravel.svg
translationOf: cloudflare-laravel
---

Cloudflare Workers ممتازة لبعض الأحمال. Laravel ممتاز لأخرى. الخطأ هو محاولة تشغيل كل شيء على أحدهما.

## ما يناسب Workers

- **توجيه الطلبات والمصادقة** — التحقق من JWT وتحديد معدل الطلبات
- **تخزين الاستجابات مؤقتًا** — استجابات API شبه ثابتة
- **مستقبلات Webhook** — استقبال أحداث خفيف مع إعادة توجيه للطابور

## ما يبقى على البنية التقليدية

- **عمليات قاعدة البيانات الثقيلة** — استعلامات معقدة ومعاملات
- **معالجة المهام الخلفية** — عمال الطوابير والمهام المجدولة

## النمط الهجين

```
Client → Cloudflare Worker (auth, cache)
       → Laravel API (business logic)
       → PostgreSQL
```

Workers تتعامل مع المسار الساخن. Laravel يتعامل مع المسار الثقيل.
