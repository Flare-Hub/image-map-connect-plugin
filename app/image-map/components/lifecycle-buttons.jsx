import { Button } from '@wordpress/components'

import cls from './lifecycle-buttons.module.scss'

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {GlobalEventHandlers['onclick']} props.onSave Action to take when the save button is pressed.
 * @param {GlobalEventHandlers['onclick']} props.onDelete Action to take when the delete button is pressed.
 */
export default function LifeCycleButtons({ onSave, onDelete }) {
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
