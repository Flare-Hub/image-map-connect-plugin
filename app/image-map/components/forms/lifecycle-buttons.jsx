import { Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useFormContext } from 'react-hook-form';

import useNotice from '../../hooks/useNotice'
import { navigate } from '../../contexts/router';

import cls from './lifecycle-buttons.module.scss'

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * Save and delete buttons.
 *
 * @param {object} props
 * @param {string} props.model Entity type of the record.
 * @param {string} props.id ID of the record to update.
 * @param {(values: EntityRecord) => Promise<void>} props.onSave Action to when clicking save.
 * @param {() => Promise<void>} props.onDelete Action to take when clicking delete
 */
export default function LifeCycleButtons({ model, id: recordId, onSave, onDelete, }) {
	const { formState, handleSubmit } = useFormContext()

	/** Save record to WordPress and select it if it was created. */
	async function saveRecord(values) {
		const { id } = await onSave(values)
		if (recordId === 'new' && id) navigate({ [model]: id })
	}

	/** Delete record from wordpress and deselect it. */
	async function delRecord() {
		const success = await onDelete()
		if (success) navigate({ [model]: null })
	}

	// Notify user if form fields fail validation on submit.
	const createNotice = useNotice()

	function handleValidationError() {
		createNotice({
			message: __('Please fill out the highlighted required fields.', 'flare'),
			style: 'error',
		})
	}

	return (
		<>
			<div className={cls.btn}>
				<Button
					variant="primary"
					className="medium"
					type="button"
					onClick={handleSubmit(saveRecord, handleValidationError)}
					disabled={!formState.isDirty || formState.isSubmitting}
				>{__('Save', 'flare')}</Button>
			</div>
			<div className={cls.btn}>
				<Button isDestructive className="medium" type="button" onClick={delRecord}>
					{__('Delete', 'flare')}
				</Button>
			</div>
		</>
	)
}
