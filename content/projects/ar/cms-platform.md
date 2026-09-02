---
title: منصة إدارة المحتوى
excerpt: نظام إدارة محتوى headless مع دعم متعدد اللغات ومعاينة فورية.
problem: فرق التسويق احتاجت نشر محتوى بثلاث لغات دون تدخل المطورين، لكن النظام القديم لم يدعم RTL.
solution: بناء CMS headless مع محتوى Markdown وAPI واعٍ باللغة ومعاينة فورية عبر WebSockets.
role: مطور رئيسي — هندسة CMS، API المحتوى، نظام المعاينة
result: تقليل وقت النشر بنسبة 70%. فريق التسويق يدير 95% من التحديثات ذاتيًا.
technologies:
  - Laravel
  - Vue.js
  - PostgreSQL
  - Astro
cover: /images/projects/cms-platform.svg
order: 4
featured: true
translationOf: cms-platform
---

## السياق

كان فريق التسويق معتمدًا على المطورين لكل تغيير محتوى. إعداد WordPress القديم لم يتعامل مع العربية RTL بشكل صحيح.

## الحل

CMS headless حيث يُخزَّن المحتوى كـ Markdown منظم مع متغيرات لغوية. نظام المعاينة يستخدم WebSockets لعرض التغييرات فورًا.
