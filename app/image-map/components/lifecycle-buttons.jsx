import { Button } from '@wordpress/components'

import { postItem, deleteItem, createItem } from '../utils/wp-fetch'

import cls from './lifecycle-buttons.module.scss'

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {Object} props.item Item to save or delete.
 * @param {string} props.collection Name of Wordpress collection to update.
 * @param {import('../contexts/global').Dispatcher} props.dispatch Function to handle the state update.
 */
export default function LifeCycleButtons({ item, collection, dispatch }) {
	// Save the new or updated item to the backend and the global state.
	async function onSave() {
		if (item.id) {
			const res = await postItem(collection, item.id, item)
			dispatch({ type: 'update', payload: res.body })
		} else {
			const res = await createItem(collection, item)
			dispatch({ type: 'add', payload: { item: res.body, select: true } })
		}
	}

	// Remove the item from the backend and the global state.
	async function onDelete() {
		const res = await deleteItem(collection, item.id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatch({ type: 'delete', payload: item.id })
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
