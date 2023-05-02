import { Button } from '@wordpress/components'
import { navigate } from '../../contexts/router'

import { deleteItem } from '../../../common/utils/wp-fetch'

import cls from './lifecycle-buttons.module.scss'

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {Object} props.id ID if the item to save or delete.
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.identifiers Name of Wordpress collection to update.
 * @param {import('../contexts/global').Dispatcher} props.dispatch Function to handle the state update.
 */
export default function LifeCycleButtons({ id, identifiers, dispatch }) {
	// Remove the item from the backend and the global state.
	async function onDelete() {
		const res = await deleteItem(identifiers.endpoint, id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatch({ type: 'delete', payload: item.id })
		navigate({ [identifiers.model]: undefined })
	}

	return (
		<>
			<div className={cls.btn}>
				<Button variant='primary' className='medium' type='submit'>Save</Button>
			</div>
			<div className={cls.btn}>
				<Button isDestructive className='medium' type='button' onClick={onDelete}>Delete</Button>
			</div>
		</>
	)
}
