---
title: "طوابير Laravel في الإنتاج — الموثوقية، الضغط العكسي، والمراقبة"
excerpt: "من Redis إلى Horizon: تصميم مهام لا تضيع، إعادة محاولة ذكية، dead-letter queues، وكيف تكتشف الاختناقات قبل أن يشتكي العملاء."
category: "البنية التحتية"
publishedAt: 2025-10-05
readingTime: 18
tags:
  - Laravel
  - Queues
  - Redis
  - Horizon
cover: /images/articles/laravel-queue-production.svg
translationOf: laravel-queue-production
---

الطوابير في Laravel تبدو بسيطة في التطوير: `dispatch(new SendInvoice($order))` وتنتهي القصة. في الإنتاج مع آلاف المهام يوميًا، القصة مختلفة تمامًا.

## لماذا تفشل الطوابير بصمت؟

الفشل الصامت أخطر من الانهيار الصريح. مهمة تُفقد، فاتورة لا تُرسل، عميل لا يُبلَّغ — ولا أحد يعرف حتى يشتكي المستخدم.

الأسباب الشائعة:
- **Timeout في Worker** — مهمة تحتاج 5 دقائق، الـ worker يقتلها بعد 60 ثانية
- **ذاكرة** — تحميل 50,000 سجل في job واحد
- **Serialization** — تمرير Eloquent model كامل مع علاقاته
- **Race condition** — نفس المهمة تُنفَّذ مرتين بعد retry

## تصميم المهام: قواعد لا تتفاوض عليها

### 1. المهام صغيرة وقابلة لإعادة المحاولة

```php
// ❌ سيء — كل شيء في مهمة واحدة
ProcessMonthlyReport::dispatch($tenantId);

// ✅ جيد — تقسيم
foreach ($tenant->users as $user) {
    GenerateUserReportChunk::dispatch($tenantId, $user->id);
}
```

### 2. مرّر المعرفات، لا النماذج

```php
public function __construct(
    public readonly int $orderId,
    public readonly int $tenantId,
) {}
```

أعد تحميل النموذج في `handle()`. النموذج قد يتغير أو يُحذف بين الإرسال والتنفيذ.

### 3. حدد $tries و$backoff بوعي

```php
public int $tries = 5;
public array $backoff = [30, 60, 120, 300, 600];

public function retryUntil(): DateTime
{
    return now()->addHours(6);
}
```

إعادة محاولة فورية × 100 على خطأ في API خارجي = حظر IP.

## Horizon: ما وراء لوحة المراقبة

Laravel Horizon ليس مجرد واجهة جميلة. استخدمه لـ:

- **Auto-scaling workers** حسب طول الطابور
- **تقسيم الطوابير** — `high`, `default`, `low`, `webhooks`
- **Metrics** — throughput، runtime، failed jobs

```php
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
```

## Dead Letter Queue: المهام الميتة

بعد استنفاد المحاولات، لا تترك المهمة في `failed_jobs` وانسَها.

النمط الذي أستخدمه:

1. `failed()` method في الـ Job يسجّل السياق الكامل
2. تنبيه Slack/PagerDuty للمهام الحرجة (دفع، إلغاء اشتراك)
3. واجهة إدارية لإعادة المحاولة اليدوية مع مراجعة

```php
public function failed(Throwable $e): void
{
    CriticalJobFailed::dispatch(
        job: static::class,
        payload: $this->orderId,
        error: $e->getMessage(),
    );
}
```

## Idempotency في المهام

Webhook من بوابة دفع يصل مرتين؟ Job يُنفَّذ مرتين؟

```php
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
```

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

`$schedule->command('reports:generate')->daily()` يعمل على **خادم واحد**. إذا كان هذا الخادم معطلاً، لا تقرير.

الأفضل: Scheduler يُرسل jobs إلى الطابور:

```php
$schedule->job(new GenerateDailyReports)->dailyAt('02:00');
```

Workers على عدة خوادم يتنافسون على التنفيذ — لا نقطة فشل واحدة.

## الخلاصة

الطوابير ليست «إرسال بريد في الخلفية». إنها **عمود فقري للموثوقية**.

- صغّر المهام
- مرّر المعرفات
- افصل الطوابير حسب الأولوية
- راقب العمق والفشل
- اجعل المهام الحرجة idempotent

عندما يعمل النظام بصمت لشهور، هذا يعني أنك بنيته بشكل صحيح — لا أنك محظوظ.
