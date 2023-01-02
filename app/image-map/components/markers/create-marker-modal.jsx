import { Button, RadioControl, ComboboxControl, Modal } from '@wordpress/components'
import { useState } from '@wordpress/element'

import { navigate } from '../../contexts/router'

import mdlCls from './create-marker-modal.module.scss'
import cls from '../forms/edit-form.module.scss'

/**
 * Modal to show when pressing the New Marker button.
 *
 * @param {object} props
 * @param {() => void} props.onRequestClose Called when save button is pressed.
 */
export default function CreateMarkerModal({ onRequestClose }) {
	const [type, setType] = useState('standalone')
	const [post, setPost] = useState()

	function handleAdd() {
		if (type === 'standalone') {
			navigate({ marker: 'new' })
		}

		onRequestClose()
	}

	return (
		<Modal
			onRequestClose={onRequestClose}
			title="Add Marker"
			overlayClassName={mdlCls.overlay}
			className={mdlCls.modal}
		>
			<RadioControl
				label="Type"
				options={[
					{ label: 'Standalone marker', value: 'standalone' },
					// { label: 'Existing post', value: 'post' },
				]}
				selected={type}
				onChange={setType}
				className={cls.field}
			/>
			<ComboboxControl
				label="Post"
				options={[
					{ label: 'List', value: '1' },
					{ label: 'of', value: '2' },
					{ label: 'custom', value: '3' },
					{ label: 'posts', value: '4' },
					{ label: 'List', value: '5' },
					{ label: 'of', value: '6' },
					{ label: 'custom', value: '7' },
					{ label: 'posts', value: '8' },
				]}
				className={cls.field + (type === 'standalone' ? ' ' + mdlCls.hidden : '')}
				value={post}
				onChange={setPost}
			/>
			<div className={mdlCls.right}>
				<Button className="short" onClick={handleAdd} variant='primary'>
					Add
				</Button>
			</div>
		</Modal>
	)
}
