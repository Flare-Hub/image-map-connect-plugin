import { useContext, createContext, useEffect } from '@wordpress/element'
import useSelected from '../hooks/useSelected'
import { wpMarkers } from '../components/markers'
import useCollection from '../hooks/useCollection'
import { useRouter } from './router'

/**
 * @typedef MarkerContext
 * @property {Object<string, any>} marker
 * @property {React.Dispatch<React.SetStateAction<Object<string, any>>>} setMarker
 * @property {boolean} loaded
 * @property {Array<Object<string, any>>} postTypes
 */

/** @type {React.Context<MarkerContext>} Create router context */
const markerContext = createContext(null)

const typesQuery = {}

/**
 * Context provider for the selected marker state.
 *
 * @param {object} props
 * @param {{id: string, type: string}} props.selected list fields from the selected marker.
 * @param {number} props.layer ID of the selected layer
 * @param {Array<Object<string, any>>} props.icons List of icons available to Markers.
 */
export function MarkerProvider({ selected, layer, icons, children }) {
	const { query } = useRouter()
	const [postTypes] = useCollection({ endpoint: 'types' }, typesQuery, { list: {} })

	// Fetch selected marker from Wordpress.
	const [marker, setMarker, loaded] = useSelected(
		(postTypes.list[selected.type] ?? {}).rest_base,
		query[wpMarkers.model],
		{ context: 'edit' },
		{
			status: 'publish',
			title: { raw: '' },
			excerpt: { raw: '' },
			imagemaps: [layer],
			'marker-icons': [],
			flare_loc: { lng: 0, lat: 0 },
			type: 'marker',
		}
	)

	// Add current layer to marker if not included already.
	useEffect(() => {
		if (Array.isArray(marker.imagemaps) && !marker.imagemaps.includes(layer)) {
			marker.imagemaps.push(layer)
		}
	}, [marker.imagemaps])

	// Select 1st marker icon by default on new markers.
	useEffect(() => {
		if (icons && icons.length && marker['marker-icons'] && !marker['marker-icons'][0]) {
			setMarker(oldMarker => ({ ...oldMarker, 'marker-icons': [icons[0].id] }))
		}
	}, [marker.id, marker.status, icons])

	return (
		<markerContext.Provider value={{ marker, setMarker, loaded, postTypes: postTypes.list }} >
			{children}
		</markerContext.Provider>
	)
}

/**
 * Get the context provided by the marker provider.
 */
export function useMarker() {
	return useContext(markerContext)
}
