import { __ } from '@wordpress/i18n';
import { useFormContext } from 'react-hook-form'

import { useRouter } from '../../contexts/router'
import LifeCycleButtons from '../forms/lifecycle-buttons'
import { wpMarkers } from '.'
import { getItem } from 'common/utils/wp-fetch'

/**
 * Buttons to save or delete a marker.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').Actions} props.actions description
 */
export default function MarkerLifecycle({ actions }) {
	const { query, navigate } = useRouter()
	const { handleSubmit, formState } = useFormContext()

	/** Save the provided marker. */
	async function onSave(data) {
		const { body: { rest_base } } = await getItem('types', data.type, { _fields: 'rest_base' })

		const markerId = await actions.save(data, rest_base)
		if (query[wpMarkers.model] === 'new') navigate({ [wpMarkers.model]: markerId })
	}

	/** Delete selected marker. */
	function onDelete() {
		actions.delete(query[wpMarkers.model])
		navigate({ [wpMarkers.model]: undefined })
	}

	return (
		<LifeCycleButtons
			canSave={formState.isDirty && !formState.isSubmitting && !formState.isSubmitSuccessful}
			onSave={handleSubmit(onSave)}
			onDelete={onDelete}
		/>
	)
}
