---
title: "معاملات موزعة بدون Two-Phase Commit — نمط Saga في Laravel"
excerpt: "عندما تتجاوز المعاملة قاعدة بيانات واحدة: orchestration مقابل choreography، تعويض الأخطاء، وضمان الاتساق عبر خدمات الدفع والإشعارات."
category: "الهندسة المعمارية"
publishedAt: 2026-03-20
readingTime: 21
tags:
  - Laravel
  - Saga
  - Distributed Systems
  - Transactions
cover: /images/articles/database-sagas-laravel.svg
translationOf: database-sagas-laravel
---

طلب واحد من المستخدم: « سجّل في الدورة، ادفع، أرسل تأكيدًا بالبريد، أضفه لمجموعة الواتساب ».

في Monolith بسيط: `DB::transaction()` وتنتهي. في منصة حقيقية: 4 خدمات، 3 قواعد بيانات، بوابة دفع خارجية — **لا معاملة ACID واحدة تغطي كل هذا**.

## لماذا Two-Phase Commit فشل في الويب؟

2PC يتطلب أن كل المشاركين يقفلون الموارد حتى يقرروا. بوابة دفع خارجية لن تقفل جدولك. خدمة بريد لن تنتظر commit قاعدة بياناتك.

البديل العملي: **Saga** — سلسلة معاملات محلية، كل واحدة قابلة للتعويض.

## Orchestration vs Choreography

### Orchestration (منسّق مركزي)

خدمة واحدة تقود التدفق:

```
OrderSaga:
  1. CreateEnrollment → نجاح
  2. ChargePayment → نجاح
  3. SendEmail → فشل
  4. Compensate: RefundPayment
  5. Compensate: DeleteEnrollment
```

```php
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
```

**مناسب لـ:** تدفقات معقدة، فريق واحد، حاجة لرؤية واضحة للحالة.

### Choreography (رقصة أحداث)

كل خدمة تستمع وتحدث:

```
EnrollmentCreated → PaymentService يشحن
PaymentCompleted → NotificationService يرسل
PaymentFailed → EnrollmentService يلغي
```

**مناسب لـ:** فرق مستقلة، توسع أفقي، فك ارتباط الخدمات.

**العيب:** صعب تتبع التدفق، خطر الحلقات، debugging أصعب.

## تنفيذ Saga في Laravel عمليًا

### جدول saga_instances

```sql
CREATE TABLE saga_instances (
    id UUID PRIMARY KEY,
    type VARCHAR(100),
    status ENUM('running','completed','compensating','failed'),
    current_step INT,
    payload JSON,
    created_at TIMESTAMP
);
```

### كل خطوة = Job

```php
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
```

## التعويض (Compensation)

ليست `rollback` — بل **إجراء معاكس**:

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

```php
DB::transaction(function () use ($enrollment) {
    $enrollment->save();

    OutboxEvent::create([
        'aggregate_type' => 'enrollment',
        'aggregate_id' => $enrollment->id,
        'event_type' => 'EnrollmentCreated',
        'payload' => $enrollment->toArray(),
    ]);
});
```

Worker منفصل ينشر أحداث Outbox إلى الطابور — مضمون التسليم حتى لو تعطل الناشر.

## متى لا تحتاج Saga؟

- عملية في خدمة واحدة + قاعدة واحدة → `DB::transaction()`
- فشل غير حرج (إرسال بريد) → fire-and-forget مع retry
- قراءة فقط → لا saga

Saga لـ **عمليات حرجة متعددة الخطوات عبر حدود خدمية**.

## الخلاصة

الأنظمة الموزعة لا تمنحك ACID عبر الخدمات. تمنحك **خيارات**:

1. **Saga orchestrated** — تحكم، وضوح، تعقيد مركزي
2. **Saga choreographed** — فك ارتباط، تعقيد توزيعي
3. **Outbox** — ضمان عدم فقدان الأحداث

اختر بوعي. وثّق التعويضات. اختبر مسارات الفشل — لأنها **ستحدث**.
