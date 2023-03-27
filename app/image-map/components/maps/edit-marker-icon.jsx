import { TextControl, Modal, Button, BaseControl, ColorPicker, Flex } from '@wordpress/components'
import { createItem, postItem } from '../../../common/utils/wp-fetch'
import { icons } from '../../utils/marker-icons'
import IconToolbarButtons from '../forms/icon-toolbar-buttons'

import cls from '../forms/edit-form.module.scss'

/**
 * A row to edit or display the marker icon.
 *
 * @param {object} props
 * @param {Object} props.icon The marker icon coming from wordpress.
 * @param {(icon:object) => void} props.setIcon Update the marker icon.
 * @param {function} props.dispatch Dispatcher called when saving the icon.
 * @param {function} props.close Function to call to close the modal.
 */
export default function EditMarkerIcon({ icon, setIcon, dispatch, close }) {
	/** Create new or update existing marker icon. */
	async function save() {
		if (icon.id) {
			const res = await postItem('marker-icons', icon.id, icon)
			dispatch({ type: 'update', payload: res.body })
		} else {
			const res = await createItem('marker-icons', icon)
			dispatch({ type: 'add', payload: res.body })
		}
		setTimeout(close)
	}

	/** Update a meta field of the marker icon */
	function setIconMeta(meta) {
		setIcon(oldIcon => ({ ...oldIcon, meta: { ...oldIcon.meta, ...meta } }))
	}

	if (!icon) return null

	return (
		<Modal title='Edit Icon Category' onRequestClose={close}>
			<TextControl
				label="Name"
				value={icon.name}
				onChange={name => setIcon(oldIcon => ({ ...oldIcon, name }))}
				className={cls.field}
			/>
			<IconToolbarButtons
				label="Icon"
				icons={icons}
				onClick={setIconMeta}
				selected={icon.meta.loc}
				colour={icon.meta.colour}
			/>
			<Flex align="flex-end">
				<BaseControl label="Colour" className={cls.field}>
					<ColorPicker color={icon.meta.colour} onChange={colour => setIconMeta({ colour })} />
				</BaseControl>
				<Button text='Save' variant="primary" onClick={save} className={cls.alignColour} />
			</Flex>
		</Modal>
	)
}
