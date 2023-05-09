import { useFormContext } from 'react-hook-form';
import filterObject from '../../utils/filter-object';
import LifeCycleButtons from "../forms/lifecycle-buttons";
import { useRouter } from '../../contexts/router';

/**
 * Buttons to save or delete a map.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').Collection} props.maps
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 */
export default function MapLifecycle({ maps, references }) {
	const { query, navigate } = useRouter()
	const mapId = query[references.model]

	const { formState, handleSubmit } = useFormContext()

	/** Save the provided map and its icons. */
	async function onSave(data) {
		const keepValues = {
			...formState.dirtyFields,
			icon_details: formState.dirtyFields.icon_details
				? formState.dirtyFields.icon_details.map(icon => ({
					...icon,
					id: true,
					delete: true,
				}))
				: [],
			id: true
		}
		const newMap = data.id ? filterObject(keepValues, data) : data

		const wpId = await maps.actions.save(newMap)
		if (mapId === 'new') navigate({ [references.model]: wpId })
	}

	/** Handle any errors when saving the map */
	function onError(err) {
		// TODO: Handle form submission errors.
		console.log(err);
	}

	/** Delete the provided map and its icons. */
	function onDelete() {
		maps.actions.delete(mapId)
		// TODO: Handle Icons
		navigate({ [references.model]: undefined })
	}

	return <LifeCycleButtons
		canSave={formState.isDirty && !formState.isSubmitting && !formState.isSubmitSuccessful}
		onSave={handleSubmit(onSave, onError)}
		onDelete={onDelete}
	/>
}
