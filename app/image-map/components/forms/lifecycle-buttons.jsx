import { Button, Flex, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useFormContext } from 'react-hook-form';

import useNotice from '../../hooks/useNotice';
import { navigate } from '../../contexts/router';

import cls from './lifecycle-buttons.module.scss';

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * Save and delete buttons.
 *
 * @param {Object}                                  props
 * @param {string}                                  props.model             Entity type of the record.
 * @param {string}                                  props.id                ID of the record to update.
 * @param {(values: EntityRecord) => Promise<void>} props.onSave            Action to when clicking save.
 * @param {() => Promise<void>}                     props.onDelete          Action to take when clicking delete
 * @param {string}                                  props.confirmDeleteText Question to ask in the confirm delete dialog.
 */
export default function LifeCycleButtons({
	model,
	id: recordId,
	onSave,
	onDelete,
	confirmDeleteText,
}) {
	const { formState, handleSubmit } = useFormContext();

	const [dialogOpen, setDialogOpen] = useState(false);

	/**
	 * Save record to WordPress and select it if it was created.
	 *
	 * @param {Object<string, any>} values
	 */
	async function saveRecord(values) {
		const { id } = await onSave(values);
		if (recordId === 'new' && id)
			navigate({ [model]: id }, { force: true });
	}

	/** Delete record from wordpress and deselect it. */
	async function delRecord() {
		const success = await onDelete();
		setDialogOpen(false);
		if (success) navigate({ [model]: null });
	}

	// Notify user if form fields fail validation on submit.
	const createNotice = useNotice();

	function handleValidationError() {
		createNotice({
			message: __(
				'Please fill out the highlighted required fields.',
				'flare-imc'
			),
			style: 'error',
		});
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
				>
					{__('Save')}
				</Button>
			</div>
			<div className={cls.btn}>
				<Button
					isDestructive
					className="medium"
					type="button"
					onClick={() => setDialogOpen(true)}
				>
					{__('Delete')}
				</Button>
			</div>
			{dialogOpen && (
				<Modal
					title={__('Delete')}
					onRequestClose={() => setDialogOpen(false)}
				>
					<p>{confirmDeleteText}</p>
					<Flex justify="end" gap={4}>
						<Button
							variant="secondary"
							className="medium"
							type="button"
							onClick={() => setDialogOpen(false)}
						>
							{__('Cancel')}
						</Button>
						<Button
							variant="primary"
							isDestructive
							className="medium"
							type="button"
							onClick={delRecord}
						>
							{__('Delete')}
						</Button>
					</Flex>
				</Modal>
			)}
		</>
	);
}
