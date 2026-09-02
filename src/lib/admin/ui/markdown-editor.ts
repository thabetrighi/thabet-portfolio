import { countWords, renderMarkdown } from './markdown';

export type EditorView = 'write' | 'preview' | 'split';

export interface MarkdownEditorHandle {
  getValue: () => string;
  setValue: (value: string) => void;
  refreshPreview: () => void;
}

interface ToolbarAction {
  action: string;
  label: string;
  title: string;
}

const TOOLBAR: ToolbarAction[] = [
  { action: 'bold', label: 'B', title: 'عريض' },
  { action: 'italic', label: 'I', title: 'مائل' },
  { action: 'h2', label: 'H2', title: 'عنوان فرعي' },
  { action: 'h3', label: 'H3', title: 'عنوان صغير' },
  { action: 'link', label: '🔗', title: 'رابط' },
  { action: 'ul', label: '•', title: 'قائمة نقطية' },
  { action: 'ol', label: '1.', title: 'قائمة مرقّمة' },
  { action: 'quote', label: '❝', title: 'اقتباس' },
  { action: 'code', label: '</>', title: 'كود' },
  { action: 'hr', label: '—', title: 'فاصل' },
];

export function initMarkdownEditor(root: HTMLElement): MarkdownEditorHandle {
  const textarea = root.querySelector<HTMLTextAreaElement>('textarea');
  if (!textarea) throw new Error('Markdown editor textarea not found');

  root.classList.add('adm-md-editor');

  const toolbar = document.createElement('div');
  toolbar.className = 'adm-md-editor__toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'أدوات التحرير');

  const viewGroup = document.createElement('div');
  viewGroup.className = 'adm-md-editor__view-group';

  const views: { id: EditorView; label: string }[] = [
    { id: 'write', label: 'كتابة' },
    { id: 'split', label: 'مقسّم' },
    { id: 'preview', label: 'معاينة' },
  ];

  const viewButtons = new Map<EditorView, HTMLButtonElement>();

  for (const v of views) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adm-md-editor__view-btn';
    btn.dataset.view = v.id;
    btn.textContent = v.label;
    btn.setAttribute('aria-pressed', v.id === 'write' ? 'true' : 'false');
    viewGroup.appendChild(btn);
    viewButtons.set(v.id, btn);
  }

  const actionsGroup = document.createElement('div');
  actionsGroup.className = 'adm-md-editor__actions';

  for (const item of TOOLBAR) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adm-md-editor__tool-btn';
    btn.dataset.action = item.action;
    btn.title = item.title;
    btn.setAttribute('aria-label', item.title);
    btn.textContent = item.label;
    actionsGroup.appendChild(btn);
  }

  toolbar.appendChild(viewGroup);
  toolbar.appendChild(actionsGroup);

  const panes = document.createElement('div');
  panes.className = 'adm-md-editor__panes';

  const writePane = document.createElement('div');
  writePane.className = 'adm-md-editor__write';

  const previewPane = document.createElement('div');
  previewPane.className = 'adm-md-editor__preview adm-prose';
  previewPane.setAttribute('aria-live', 'polite');

  textarea.classList.add('adm-md-editor__textarea');
  writePane.appendChild(textarea);

  panes.appendChild(writePane);
  panes.appendChild(previewPane);

  const footer = document.createElement('div');
  footer.className = 'adm-md-editor__footer';
  const stats = document.createElement('span');
  stats.className = 'adm-md-editor__stats';
  footer.appendChild(stats);

  root.insertBefore(toolbar, textarea);
  root.appendChild(panes);
  root.appendChild(footer);

  let view: EditorView = 'write';

  function updateStats() {
    const chars = textarea.value.length;
    const words = countWords(textarea.value);
    stats.textContent = `${words} كلمة · ${chars.toLocaleString('ar')} حرف`;
  }

  function refreshPreview() {
    previewPane.innerHTML = textarea.value.trim()
      ? renderMarkdown(textarea.value)
      : '<p class="adm-md-editor__empty">لا يوجد محتوى للمعاينة بعد</p>';
    updateStats();
  }

  function setView(next: EditorView) {
    view = next;
    root.dataset.view = view;
    for (const [id, btn] of viewButtons) {
      btn.classList.toggle('is-active', id === view);
      btn.setAttribute('aria-pressed', id === view ? 'true' : 'false');
    }
    refreshPreview();
  }

  function wrapSelection(before: string, after = before) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    textarea.value = `${textarea.value.slice(0, start)}${before}${selected}${after}${textarea.value.slice(end)}`;
    const cursor = start + before.length + selected.length;
    textarea.setSelectionRange(cursor, cursor);
    textarea.focus();
    refreshPreview();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function insertLine(prefix: string) {
    const start = textarea.selectionStart;
    const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
    textarea.value = `${textarea.value.slice(0, lineStart)}${prefix}${textarea.value.slice(lineStart)}`;
    const cursor = start + prefix.length;
    textarea.setSelectionRange(cursor, cursor);
    textarea.focus();
    refreshPreview();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function applyAction(action: string) {
    switch (action) {
      case 'bold':
        wrapSelection('**');
        break;
      case 'italic':
        wrapSelection('_');
        break;
      case 'h2':
        insertLine('## ');
        break;
      case 'h3':
        insertLine('### ');
        break;
      case 'link': {
        const url = window.prompt('أدخل الرابط (https://...)');
        if (!url) return;
        wrapSelection('[', `](${url})`);
        break;
      }
      case 'ul':
        insertLine('- ');
        break;
      case 'ol':
        insertLine('1. ');
        break;
      case 'quote':
        insertLine('> ');
        break;
      case 'code':
        wrapSelection('`');
        break;
      case 'hr':
        insertLine('\n---\n');
        break;
    }
  }

  viewGroup.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-view]');
    if (!btn?.dataset.view) return;
    setView(btn.dataset.view as EditorView);
  });

  actionsGroup.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
    if (!btn?.dataset.action) return;
    applyAction(btn.dataset.action);
  });

  textarea.addEventListener('input', refreshPreview);

  setView('write');

  return {
    getValue: () => textarea.value,
    setValue: (value: string) => {
      textarea.value = value;
      refreshPreview();
    },
    refreshPreview,
  };
}
