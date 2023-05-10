import { useFormContext } from 'react-hook-form';

import { postItem } from 'common/utils/wp-fetch';
import LifeCycleButtons from "../forms/lifecycle-buttons";
import { useRouter } from '../../contexts/router';
import { mapRefs } from '../maps';

/**
 * Buttons to save or delete a layer.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').Collection} props.layers
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 */
export default function LayerLifecycle({ layers, references }) {
	const { query, navigate } = useRouter()

	const { formState, handleSubmit } = useFormContext()

	/** Save layer and add i tto the current map. */
	async function onSave(data) {
		const layerId = await layers.actions.save(data)

		const mapLayerIds = layers.list.map(layer => layer.id)
		if (!mapLayerIds.includes(layerId)) {
			await postItem(mapRefs.endpoint, query[references.parent], { layers: [...mapLayerIds, layerId] })
		}

		if (query[references.model] === 'new') navigate({ [references.model]: layerId })
	}

	/** Handle any errors when saving the layer. */
	function onError(err) {
		// TODO: Handle form submission errors.
		console.log(err);
	}

	/** Delete the current layer. */
	function onDelete() {
		layers.actions.delete(+query[references.model])
		navigate({ [references.model]: undefined })
	}

	return <LifeCycleButtons
		canSave={formState.isDirty && !formState.isSubmitting && !formState.isSubmitSuccessful}
		onSave={handleSubmit(onSave, onError)}
		onDelete={onDelete}
	/>
}
