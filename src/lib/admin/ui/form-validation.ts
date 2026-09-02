import type { z } from 'zod';
import { sanitizeSlug } from '../validation';

const validationMessages: Record<string, string> = {
  slug_required: 'المعرّف (slug) مطلوب',
  slug_too_long: 'المعرّف طويل جداً (الحد الأقصى 80 حرفاً)',
  invalid_slug: 'المعرّف يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط',
  title_required: 'العنوان مطلوب',
  title_too_long: 'العنوان طويل جداً',
  excerpt_required: 'المقتطف مطلوب',
  excerpt_too_long: 'المقتطف طويل جداً',
  category_required: 'التصنيف مطلوب',
  invalid_date: 'تاريخ النشر غير صالح',
  body_required: 'المحتوى مطلوب',
  body_too_long: 'المحتوى تجاوز الحد المسموح',
  problem_required: 'وصف المشكلة مطلوب',
  solution_required: 'وصف الحل مطلوب',
  role_required: 'الدور مطلوب',
  result_required: 'النتيجة مطلوبة',
  invalid_url: 'الرابط غير صالح',
  invalid_path: 'مسار الملف غير صالح',
  validation_error: 'بيانات غير صالحة',
};

export function translateValidationError(code: string): string {
  return validationMessages[code] || code;
}

export function validateWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { ok: true; data: T } | { ok: false; message: string; field?: string } {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };

  const issue = result.error.issues[0];
  const path = issue?.path?.join('.') || undefined;
  const message = translateValidationError(issue?.message || 'validation_error');
  return { ok: false, message, field: path };
}

export function bindSlugFromTitle(titleInput: HTMLInputElement, slugInput: HTMLInputElement, enabled = true) {
  let manual = Boolean(slugInput.value);

  slugInput.addEventListener('input', () => {
    manual = true;
  });

  titleInput.addEventListener('input', () => {
    if (!enabled || manual) return;
    slugInput.value = sanitizeSlug(titleInput.value);
  });
}

export function showFieldError(fieldId: string, message: string | null) {
  const input = document.getElementById(fieldId);
  const field = input?.closest('.adm-field');
  if (!field) return;

  let error = field.querySelector<HTMLElement>('.adm-field-error');
  if (message) {
    input?.classList.add('adm-input--error');
    input?.setAttribute('aria-invalid', 'true');
    if (!error) {
      error = document.createElement('p');
      error.className = 'adm-field-error';
      error.setAttribute('role', 'alert');
      field.appendChild(error);
    }
    error.textContent = message;
  } else {
    input?.classList.remove('adm-input--error');
    input?.removeAttribute('aria-invalid');
    error?.remove();
  }
}

export function clearFieldErrors(form: HTMLElement) {
  form.querySelectorAll('.adm-field-error').forEach((el) => el.remove());
  form.querySelectorAll('.adm-input--error').forEach((el) => el.classList.remove('adm-input--error'));
}
