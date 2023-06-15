import { createContext, useContext, forwardRef } from '@wordpress/element'
import { BaseControl, Toolbar, ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline"

import cls from '../forms/edit-form.module.scss'
import rteCls from './rich-text-editor.module.scss'

/** @type {React.Context<Editor>} */
const EditorContext = createContext()

/**
 * Button that formats TipTap content using the provided styling.
 *
 * @param {object} props
 * @param {string} props.icon
 * @param {string} props.style
 * @param {object} props.config
 * @param {string} props.toggler
 * @returns
 */
function StyleButton({ icon, style, config, toggler }) {
	const editor = useContext(EditorContext)

	return (
		<ToolbarButton
			icon={icon}
			isActive={editor && editor.isActive(style, config)}
			onClick={() => editor.chain().focus()[toggler](config).run()}
			disabled={editor && !editor.can().chain().focus()[toggler](config).run()}
		/>
	)
}

/**
 * TipTap editor
 *
 * @param {object} props
 * @param {string} props.label Form label visible to the end user.
 * @param {string} props.value The html to edit.
 * @param {(content: string) => void} props.onChange Provide changed content on blur.
 * @param {Array<any>} props.dependencies Dependencies that should reload the editor.
 * @param {string} props.className
 */
function RichTextEditor({ label, value, onChange, dependencies = [], className }, ref) {
	// Initialize TipTap editor
	const editor = useEditor({
		extensions: [StarterKit, Underline],
		content: value,
		onBlur: ({ editor }) => onChange && onChange(editor.getHTML())
	}, dependencies)

	return (
		<EditorContext.Provider value={editor} >
			<BaseControl label={label} className={className}>
				<div className={`${cls.input} ${cls.border} ${editor && editor.isFocused && rteCls.focused}`}>
					<Toolbar label={label} className={rteCls.toolbar}>
						<ToolbarGroup>
							<StyleButton icon="heading" style="heading" config={{ level: 3 }} toggler="toggleHeading" />
							<StyleButton icon="format-quote" style="blockquote" toggler="toggleBlockquote" />
						</ToolbarGroup>
						<ToolbarGroup>
							<StyleButton icon="editor-bold" style="bold" toggler="toggleBold" />
							<StyleButton icon="editor-italic" style="italic" toggler="toggleItalic" />
							<StyleButton icon="editor-underline" style="underline" toggler="toggleUnderline" />
						</ToolbarGroup>
						<ToolbarGroup>
							<StyleButton icon="editor-ul" style="bulletList" toggler="toggleBulletList" />
							<StyleButton icon="editor-ol" style="orderedList" toggler="toggleOrderedList" />
						</ToolbarGroup>
						<ToolbarGroup>
							<ToolbarButton
								icon={'editor-removeformatting'}
								onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
							/>
						</ToolbarGroup>
						<ToolbarGroup>
							<div className={rteCls.filler}></div>
						</ToolbarGroup>
					</Toolbar>
					<EditorContent editor={editor} className={rteCls.editor} ref={ref} />
				</div>
			</BaseControl >
		</EditorContext.Provider>
	)
}

export default forwardRef(RichTextEditor)
