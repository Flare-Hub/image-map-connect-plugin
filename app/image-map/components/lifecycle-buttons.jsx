import { Button } from '@wordpress/components'
import { navigate } from '../contexts/router'

import { postItem, deleteItem, createItem } from '../utils/wp-fetch'

import cls from './lifecycle-buttons.module.scss'

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {Object} props.item Item to save or delete.
 * @param {import('../hooks/useCollection').WpIdentifiers} props.identifiers Name of Wordpress collection to update.
 * @param {import('../contexts/global').Dispatcher} props.dispatch Function to handle the state update.
 */
export default function LifeCycleButtons({ item, identifiers, dispatch }) {
	// Save the new or updated item to the backend and the global state.
	async function onSave() {
		const query = { context: 'edit' }
		if (item.id) {
			const res = await postItem(identifiers.endpoint, item.id, item, query)
			dispatch({ type: 'update', payload: res.body })
		} else {
			const res = await createItem(identifiers.endpoint, item, query)
			dispatch({ type: 'add', payload: { item: res.body, select: true } })
			navigate({ [identifiers.model]: res.body.id })
		}
	}

	// Remove the item from the backend and the global state.
	async function onDelete() {
		const res = await deleteItem(identifiers.endpoint, item.id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatch({ type: 'delete', payload: item.id })
		navigate({ [identifiers.model]: undefined })
	}

	return (
		<>
			<div className={cls.btn}>
				<Button variant='primary' className='medium' onClick={onSave}>Save</Button>
			</div>
			<div className={cls.btn}>
				<Button isDestructive className='medium' onClick={onDelete}>Delete</Button>
			</div>
		</>
	)
}
