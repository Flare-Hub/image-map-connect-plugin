
import { BaseControl, Toolbar, ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline"

import cls from '../forms/edit-form.module.scss'
import rteCls from './rich-text-editor.module.scss'

/**
 * Rich text editor
 *
 * @param {object} props
 * @param {string} props.label Form label visible to the end user.
 * @param {string} props.content The html to edit.
 * @param {(content: string) => void} props.onChange Provide changed content on blur.
 */
export default function RichTextEditor({ label, content, onChange }) {
	const editor = useEditor({
		extensions: [StarterKit, Underline],
		content: content,
		onBlur: ({ editor }) => onChange && onChange(editor.getHTML())
	})

	return (
		<BaseControl label={label} className={cls.field}>
			<div className={cls.input}>
				<Toolbar label={label} className={rteCls.toolbar}>
					<ToolbarGroup>
						<ToolbarButton
							icon={'heading'}
							isActive={editor && editor.isActive('heading', { level: 2 })}
							onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
							disabled={editor && !editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
						/>
						<ToolbarButton
							icon={'format-quote'}
							isActive={editor && editor.isActive('blockquote')}
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							disabled={editor && !editor.can().chain().focus().toggleBlockquote().run()}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarButton
							icon={'editor-bold'}
							isActive={editor && editor.isActive('bold')}
							onClick={() => editor.chain().focus().toggleBold().run()}
							disabled={editor && !editor.can().chain().focus().toggleBold().run()}
						/>
						<ToolbarButton
							icon={'editor-italic'}
							isActive={editor && editor.isActive('italic')}
							onClick={() => editor.chain().focus().toggleItalic().run()}
							disabled={editor && !editor.can().chain().focus().toggleItalic().run()}
						/>
						<ToolbarButton
							icon={'editor-underline'}
							isActive={editor && editor.isActive('underline')}
							onClick={() => editor.chain().focus().toggleUnderline().run()}
							disabled={editor && !editor.can().chain().focus().toggleUnderline().run()}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarButton
							icon={'editor-ul'}
							isActive={editor && editor.isActive('bulletList')}
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							disabled={editor && !editor.can().chain().focus().toggleBulletList().run()}
						/>
						<ToolbarButton
							icon={'editor-ol'}
							isActive={editor && editor.isActive('orderedList')}
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							disabled={editor && !editor.can().chain().focus().toggleOrderedList().run()}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarButton
							icon={'editor-removeformatting'}
							onClick={() => editor.chain().focus().unsetAllMarks().run()}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<div className={rteCls.filler}></div>
					</ToolbarGroup>
				</Toolbar>
				<EditorContent editor={editor} className={rteCls.editor} />
			</div>
		</BaseControl >
	)
}
