import { useFormContext } from 'react-hook-form';
import useNotice from '../../hooks/useNotice'
import { navigate } from '../../contexts/router';
import LifeCycleButtons from "../forms/lifecycle-buttons";
import { mapRefs } from '.';

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * Buttons to save or delete a map.
 *
 * @param {object} props
 * @param {(values: EntityRecord) => Promise<void>} props.save
 * @param {() => Promise<void>} props.delete
 * @param {string} props.id
 */
export default function MapLifecycle({ save, delete: del, id: mapId }) {
	const { formState, handleSubmit } = useFormContext()
	/**
	 * Save map to WordPress and update url query with the map id.
	 */
	async function saveMap(values) {
		const { id } = await save(values)
		if (mapId === 'new' && id) navigate({ [mapRefs.model]: id })
	}

	async function delMap() {
		const success = await del()
		if (success) navigate({ [mapRefs.model]: undefined })
	}

	// Notify user if form fields fail validation on submit.
	const createNotice = useNotice()

	function handleValidationError() {
		createNotice({
			message: __('Please fill out the highlighted required fields.', 'flare'),
			style: 'error',
		})
	}

	return <LifeCycleButtons
		canSave={formState.isDirty && !formState.isSubmitting}
		onSave={handleSubmit(saveMap, handleValidationError)}
		onDelete={delMap}
	/>
}
