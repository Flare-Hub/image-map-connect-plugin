import { useEffect } from '@wordpress/element'
import useSelected from '../hooks/useSelected'
import { wpMarkers } from '../components/markers'
import { useRouter } from './router'
import { FormProvider, useForm } from 'react-hook-form'

/**
 * Context provider for the selected marker state.
 *
 * @param {object} props
 * @param {import('../components/markers').MarkerListing} props.selected list fields from the selected marker.
 * @param {number} props.layer ID of the selected layer
 * @param {Array<Object<string, unknown>>} props.icons List of icons available to Markers.
 * @param {Array.<Object<string, unknown>>} props.postTypes All post types applicable to markers.
 */
export function MarkerProvider({ selected, layer, icons, postTypes, children }) {
	const { query } = useRouter()

	// Fetch selected marker from Wordpress.
	const [marker, setMarker] = useSelected(
		(postTypes[selected.type] ?? {}).rest_base,
		query[wpMarkers.model],
		{ context: 'edit' },
		{
			status: 'publish',
			title: { raw: '' },
			excerpt: { raw: '' },
			layers: [layer],
			'marker-icons': selected['marker-icons'] ?? [],
			flare_loc: selected.flare_loc ?? { lng: 0, lat: 0 },
			type: selected.type ?? 'marker',
		},
		[query[wpMarkers.model], postTypes[selected.type]],
	)

	// Add current layer to marker if not included already.
	useEffect(() => {
		if (Array.isArray(marker.layers) && !marker.layers.includes(layer)) {
			marker.layers.push(layer)
		}
	}, [marker.layers])

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		values: marker,
	})

	// Select 1st marker icon by default on new markers.
	useEffect(() => {
		if (icons && icons.length && marker['marker-icons'] && !marker['marker-icons'][0]) {
			form.setValue('marker-icons', [icons[0].id])
		}
	}, [marker['marker-icons'], icons])

	// Reset form after successful submission.
	useEffect(() => {
		if (form.formState.isSubmitSuccessful) {
			setMarker(form.getValues())
		}
	}, [form.formState.isSubmitSuccessful])

	return (
		<FormProvider {...form}>
			{children}
		</FormProvider>
	)
}
