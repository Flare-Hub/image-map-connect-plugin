import { useContext, createContext, useEffect } from '@wordpress/element'
import useSelected from '../hooks/useSelected'
import { wpMarkers } from '../components/markers'
import { useRouter } from './router'

/**
 * @typedef {React.Dispatch<React.SetStateAction<Object<string, any>>>} MarkerSetter
 */

/** @type {React.Context<[Object<string, any>, MarkerSetter]>} Create router context */
const markerContext = createContext(null)

/**
 * Context provider for the selected marker state.
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 */
export function MarkerProvider({ icons, children }) {
	const { query } = useRouter()

	// Fetch selected marker from Wordpress.
	const [marker, setMarker] = useSelected(
		wpMarkers,
		{ context: 'edit' },
		{
			status: 'publish',
			title: { raw: '' },
			excerpt: { raw: '' },
			imagemaps: [query[wpMarkers.parent]],
			'marker-icons': [],
			flare_loc: {},
			type: 'marker',
		}
	)

	useEffect(() => {
		if (icons && icons.length && marker['marker-icons'] && !marker['marker-icons'][0]) {
			setMarker(oldMarker => ({ ...oldMarker, 'marker-icons': [icons[0].id] }))
		}
	}, [marker.id, marker.status, icons])

	return (
		<markerContext.Provider value={[marker, setMarker]} >
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
