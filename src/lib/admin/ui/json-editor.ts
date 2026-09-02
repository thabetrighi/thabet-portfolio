import { createJSONEditor, type Content, type JSONEditor } from 'vanilla-jsoneditor/standalone.js';

let editor: JSONEditor | null = null;

export function mountProfileJsonEditor(
  target: HTMLElement,
  initialContent: unknown,
  onChange: (content: unknown) => void,
) {
  editor?.destroy();
  editor = createJSONEditor({
    target,
    props: {
      content: { json: initialContent } as Content,
      mode: 'tree',
      mainMenuBar: true,
      navigationBar: true,
      onChange: (updatedContent) => {
        if ('json' in updatedContent && updatedContent.json !== undefined) {
          onChange(updatedContent.json);
        }
      },
    },
  });
  return editor;
}

export function destroyProfileJsonEditor() {
  editor?.destroy();
  editor = null;
}

export function getEditorContent(): unknown {
  const content = editor?.get();
  if (content && 'json' in content) return content.json;
  return null;
}
