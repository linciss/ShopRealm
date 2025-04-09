'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  Heading3,
  Redo,
  Undo,
  RemoveFormatting,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { forwardRef, useImperativeHandle } from 'react';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Heading } from '@tiptap/extension-heading';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface RichTextEditorRef {
  editor: Editor | null;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Write something...',
      className,
      disabled = false,
    },
    ref,
  ) => {
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [3],
          },
        }),
        Heading.configure({
          levels: [3],
          HTMLAttributes: {
            class: 'font-semibold text-lg',
          },
        }),
        Underline,
        Placeholder.configure({
          placeholder,
        }),
        BulletList.configure({
          itemTypeName: 'listItem',
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
          keepMarks: false,
          keepAttributes: false,
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      editor,
    }));

    if (!editor) {
      return null;
    }

    return (
      <div
        className={cn('border rounded-md', className, disabled && 'opacity-60')}
      >
        <div className='flex flex-wrap items-center gap-1 p-1 border-b'>
          <Toggle
            size='sm'
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
            aria-label='Bold'
          >
            <Bold className='h-4 w-4' />
          </Toggle>
          <Toggle
            size='sm'
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
            aria-label='Italic'
          >
            <Italic className='h-4 w-4' />
          </Toggle>
          <Toggle
            size='sm'
            pressed={editor.isActive('underline')}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            disabled={disabled}
            aria-label='Underline'
          >
            <UnderlineIcon className='h-4 w-4' />
          </Toggle>

          <Separator orientation='vertical' className='mx-1 h-6' />

          <Toggle
            size='sm'
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={disabled}
            aria-label='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </Toggle>

          <Separator orientation='vertical' className='mx-1 h-6' />

          <Toggle
            size='sm'
            pressed={editor.isActive('bulletList')}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            disabled={disabled}
            aria-label='Bullet List'
          >
            <List className='h-4 w-4' />
          </Toggle>

          <Separator orientation='vertical' className='mx-1 h-6' />

          <Toggle
            size='sm'
            onPressedChange={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            disabled={disabled}
            aria-label='Clear Formatting'
          >
            <RemoveFormatting className='h-4 w-4' />
          </Toggle>

          <div className='ml-auto flex items-center gap-1'>
            <Toggle
              size='sm'
              onPressedChange={() => editor.chain().focus().undo().run()}
              disabled={disabled || !editor.can().undo()}
              aria-label='Undo'
            >
              <Undo className='h-4 w-4' />
            </Toggle>
            <Toggle
              size='sm'
              onPressedChange={() => editor.chain().focus().redo().run()}
              disabled={disabled || !editor.can().redo()}
              aria-label='Redo'
            >
              <Redo className='h-4 w-4' />
            </Toggle>
          </div>
        </div>
        <EditorContent
          editor={editor}
          className={cn(
            'prose prose-sm max-w-none p-4 focus:outline-none',
            'prose-headings:my-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2',
            'min-h-[200px]',
          )}
        />
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
