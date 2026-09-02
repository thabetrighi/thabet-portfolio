---
title: "RBAC يتجاوز الأدوار — حدود الصلاحيات في منصات Laravel المؤسسية"
excerpt: "من أدوار بسيطة إلى سياسات معقدة: صلاحيات على مستوى المورد، التفويض المؤقت، والتدقيق — دون تحويل كل controller إلى متاهة if."
category: "الأمان"
publishedAt: 2026-02-15
readingTime: 17
tags:
  - Laravel
  - RBAC
  - Security
  - Enterprise
cover: /images/articles/laravel-rbac-enterprise.svg
translationOf: laravel-rbac-enterprise
---

`@can('edit-post')` يعمل بشكل رائع لمدوّنة. منصة مؤسسية بـ 15 دورًا، 200 صلاحية، وفرق متعددة؟ تتحول إلى كابوس.

## متى يكسر RBAC البسيط؟

- **صلاحيات على مستوى المورد:** « يحرر فقط فعالياته »
- **تفويض مؤقت:** « مدير الإقليم يوافق نيابة عن المدير العام لأسبوع »
- **سياق ديناميكي:** « يشاهد التقارير المالية لفرعه فقط »
- **تدقيق:** « من غيّر صلاحيات هذا المستخدم؟ »

## الطبقات الثلاث

### 1. الأدوار (Roles) — للتجميع فقط

الدور `event-manager` يجمع صلاحيات. لا يُنفّذ منطقًا.

### 2. الصلاحيات (Permissions) — أفعال ذرية

`events.create`, `events.update.own`, `events.update.any`, `reports.financial.view`

التسمية: `resource.action.scope`

### 3. السياسات (Policies) — المنطق المعقد

```php
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
```

## نطاق المستأجر + RBAC

في SaaS متعدد المستأجرين، الصلاحية بدون سياق المستأجر عديمة الفائدة.

```php
// Middleware: SetPermissionsTeamId (spatie/laravel-permission)
app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);
```

كل استعلام صلاحية يُفلتر تلقائيًا بالمستأجر.

## التفويض المؤقت

```php
// delegations table
// delegator_id, delegate_id, permission, starts_at, ends_at
```

عند التحقق:

```php
public function hasDelegatedPermission(User $user, string $permission): bool
{
    return Delegation::active()
        ->where('delegate_id', $user->id)
        ->where('permission', $permission)
        ->exists();
}
```

## التدقيق: غير قابل للتفاوض

كل تغيير صلاحية يُسجّل:

```php
PermissionAudit::create([
    'actor_id' => auth()->id(),
    'target_user_id' => $target->id,
    'action' => 'granted',
    'permission' => 'events.delete.any',
    'ip' => request()->ip(),
]);
```

في منصات الامتثال، هذا ليس رفاهية — إنه متطلب.

## أداء التحقق من الصلاحيات

200 صلاحية × 50 طلب/ثانية = كارثة إذا كل طلب يستعلم قاعدة البيانات.

**الحلول:**
- Cache صلاحيات المستخدم (TTL 5–15 دقيقة، إبطال عند التغيير)
- Eager load في بداية الطلب
- `Gate::before()` للـ super-admin فقط — ليس لكل صلاحية

## أخطاء شائعة

| الخطأ | البديل |
|-------|--------|
| `if ($user->role === 'admin')` في 40 مكان | Policy مركزية |
| صلاحيات في JWT طويل العمر | تحقق من DB أو cache قصير |
| أدوار متداخلة بلا حدود | تسلسل هرمي واضح + ممنوع الدورين المتعارضين |
| نسيان صلاحيات الـ API | نفس Policies للـ web والـ API |

## الخلاصة

RBAC المؤسسي = أدوار للتجميع + صلاحيات ذرية + سياسات للمنطق + تدقيق للامتثال.

ابنِ الطبقات من البداية. إضافة Policy لاحقًا على 200 controller = مشروع بحد ذاته.
