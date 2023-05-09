import { Button } from '@wordpress/components'

import cls from './lifecycle-buttons.module.scss'

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {boolean} props.canSave Enable the save button.
 * @param {() => void} props.onSave Action to when clicking save. Set to 'submit' to submit the parent form.
 * @param {() => void} props.onDelete Action to take when clicking delete
 */
export default function LifeCycleButtons({ canSave = true, onSave, onDelete }) {
	return (
		<>
			<div className={cls.btn}>
				<Button
					variant='primary'
					className='medium'
					type="submit"
					onClick={onSave}
					disabled={!canSave}
				>Save</Button>
			</div>
			<div className={cls.btn}>
				<Button isDestructive className='medium' type='button' onClick={onDelete}>
					Delete
				</Button>
			</div>
		</>
	)
}
