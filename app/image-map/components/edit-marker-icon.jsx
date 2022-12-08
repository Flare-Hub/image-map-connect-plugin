import { TextControl, Modal, Button, BaseControl, ColorPicker, Flex } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { createItem, postItem } from '../utils/wp-fetch'
import MarkerIconButtons from './marker-icon-buttons'

import cls from './edit-form.module.scss'

/**
 * A row to edit or display the marker icon.
 *
 * @param {object} props
 * @param {Object} props.icon The marker icon coming from wordpress.
 * @param {function} props.dispatch Dispatcher called when saving the icon.
 * @param {function} props.close Function to call to close the modal.
 */
export default function EditMarkerIcon({ icon, dispatch, close }) {
	const [updIcon, setUpdIcon] = useState()

	// Copy controlled version of marker icon to manage the state locally whilst editing.
	useEffect(() => {
		setUpdIcon(icon)
	}, [])

	/** Create new or update existing marker icon. */
	async function save() {
		if (updIcon.id) {
			const res = await postItem('marker-icons', updIcon.id, updIcon)
			dispatch({ type: 'update', payload: res.body })
		} else {
			const res = await createItem('marker-icons', updIcon)
			dispatch({ type: 'add', payload: res.body })
		}
		setTimeout(close)
	}

	/** Update a meta field of the marker icon */
	function setIconMeta(meta) {
		setUpdIcon(oldIcon => ({ ...oldIcon, meta: { ...oldIcon.meta, ...meta } }))
	}

	if (!updIcon) return <></>

	return (
		<Modal title='Edit Icon Category' onRequestClose={close}>
			<TextControl
				label="Name"
				value={updIcon.name}
				onChange={name => setUpdIcon(oldIcon => ({ ...oldIcon, name }))}
				className={cls.field}
			/>
			<BaseControl label="Icon" className={`${cls.field} ${cls.iconGroup}`}>
				<MarkerIconButtons
					onClick={setIconMeta}
					selected={updIcon.meta.icon}
					colour={updIcon.meta.colour}
				/>
			</BaseControl>
			<Flex align="flex-end">
				<BaseControl label="Colour" className={cls.field}>
					<ColorPicker color={updIcon.meta.colour} onChange={colour => setIconMeta({ colour })} />
				</BaseControl>
				<Button text='Save' variant="primary" onClick={save} className={cls.alignColour} />
			</Flex>
		</Modal>
	)
}
