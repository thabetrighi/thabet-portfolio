---
title: "مفاتيح التكرار الآمن والـ Webhooks — وهم التنفيذ مرة واحدة في أنظمة الدفع"
excerpt: "لماذا تفشل معاملات الدفع المكررة، كيف تصمم Idempotency Keys صحيحة، وتتعامل مع webhooks متأخرة أو مكررة دون كسر المحاسبة."
category: "تصميم API"
publishedAt: 2025-12-01
readingTime: 19
tags:
  - API
  - Payments
  - Webhooks
  - Idempotency
cover: /images/articles/api-idempotency-webhooks.svg
translationOf: api-idempotency-webhooks
---

في نظام دفع حقيقي، السؤال ليس « هل سيُرسل العميل نفس الطلب مرتين؟ » بل « **متى** سيُرسله مرتين؟ »

انقطاع الشبكة، زر مزدوج، إعادة محاولة تلقائية من الموبايل، webhook متأخر من البوابة — كلها سيناريوهات يومية.

## Idempotency Key: العقد بين العميل والخادم

الفكرة: العميل يولّد مفتاحًا فريدًا لكل عملية منطقية، ويرسله مع الطلب. الخادم يضمن أن نفس المفتاح = نفس النتيجة، مهما تكرر الطلب.

```http
POST /api/v1/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "amount": 15000,
  "currency": "SAR",
  "order_id": "ORD-2026-0042"
}
```

### دورة حياة المفتاح

1. **طلب أول** — الخادم يبدأ معاملة، يسجّل المفتاح بحالة `processing`
2. **طلب مكرر (نفس المفتاح، نفس الجسم)** — يُعاد نفس الرد (200/201) دون إعادة التنفيذ
3. **طلب مكرر (نفس المفتاح، جسم مختلف)** — 409 Conflict
4. **انتهاء الصلاحية** — بعد 24–72 ساعة، المفتاح يُحذف

```php
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
```

## Webhooks: العالم المقلوب

مع REST API، العميل يتحكم بالتوقيت. مع Webhooks، **الخادم الخارجي يقرر متى يرسل**.

### المشاكل الحقيقية

- **تسليم مكرر** — نفس الحدث 3 مرات
- **تسليم متأخر** — حدث قبل أسبوع يصل اليوم
- **ترتيب خاطئ** — `payment.completed` قبل `payment.pending`
- **توقيع غير صالح** — هجوم أو خطأ في المفتاح

### نموذج المعالجة الآمن

```php
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
```

**قاعدة ذهبية:** الرد على Webhook خلال 5 ثوانٍ. المعالجة الثقيلة في Job.

### ترتيب الأحداث

لا تعتمد على الترتيب. استخدم **حالة آلة (state machine)**:

```
pending → processing → completed
                   → failed
                   → refunded
```

حدث `completed` لوصل قبل `pending`؟ خزّنه، طبّقه عندما تصبح الحالة مناسبة، أو ارفض إذا كانت انتقالًا غير قانوني.

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

صمّم لذلك من اليوم الأول — إضافته لاحقًا أغلى بمراتب.
